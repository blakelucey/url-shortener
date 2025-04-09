// src/main/java/com/example/redirectionservice/controller/RedirectionController.java
package com.redirectionservice.controller;

import com.redirectionservice.model.Click;
import com.redirectionservice.model.UrlMapping;
import com.redirectionservice.repository.UrlMappingRepository;
import com.redirectionservice.service.AsyncClickService;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;
import io.ipinfo.api.IPinfo;
import io.ipinfo.api.model.IPResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@RestController
public class RedirectionController {

    @Autowired
    private UrlMappingRepository urlRepository;

    @Autowired
    private AsyncClickService asyncClickService;

    @Autowired
    private MongoTemplate mongoTemplate; // For querying the "links" collection

    // Inject the token from your environment (loaded via Dotenv)
    @Value("${NEXT_IPINFO_TOKEN}")
    private String ipinfoToken;

    // In-memory cache for geolocation data keyed by IP address.
    private static final ConcurrentHashMap<String, CacheEntry> geoCache = new ConcurrentHashMap<>();
    // Cache TTL: 1 hour.
    private static final long CACHE_TTL_MS = TimeUnit.HOURS.toMillis(1);

    // Utility method to fetch the server's public IP
    public static String getIp() throws IOException {
        URL whatismyip = new URL("http://checkip.amazonaws.com");
        try (BufferedReader in = new BufferedReader(new InputStreamReader(whatismyip.openStream()))) {
            return in.readLine();
        }
    }

    @GetMapping("/{shortHash}")
    public RedirectView redirect(@PathVariable String shortHash, HttpServletRequest request) {
        // Retrieve the URL mapping from your redirection service.
        UrlMapping mapping = urlRepository.findByShortHash(shortHash);
        System.out.println("Redirect request for short code: " + shortHash);
        if (mapping == null) {
            System.out.println("No URL mapping found for: " + shortHash);
            return new RedirectView("/404");
        }

        // Query the "links" collection (created by your Java microservice)
        Query query = new Query(Criteria.where("shortHash").is(shortHash));
        Document linkDoc = mongoTemplate.findOne(query, Document.class, "links");
        ObjectId linkId = null;
        if (linkDoc != null && linkDoc.get("_id") != null) {
            linkId = linkDoc.getObjectId("_id");
            System.out.println("Links _id: " + linkId.toHexString());
        } else {
            System.out.println("No matching link found in links collection for shortHash: " + shortHash);
        }

        // Extract ipAddress
        String ipAddress;
        try {
            ipAddress = getIp();
        } catch (IOException e) {
            e.printStackTrace();
            ipAddress = null;
        }
        // Extract request data.
        String userAgent = request.getHeader("User-Agent");
        String referrer = request.getHeader("Referer") != null ? request.getHeader("Referer") : "Direct";

        // Retrieve geolocation data.
        Map<String, String> geoData = getGeoLocation(ipAddress);

        // Extract UTM parameters from the link document.
        // (Assuming the document keys match exactly, e.g., "utm_source", "utm_medium",
        // etc.)
        String utm_source = linkDoc != null ? linkDoc.getString("utm_source") : null;
        String utm_medium = linkDoc != null ? linkDoc.getString("utm_medium") : null;
        String utm_campaign = linkDoc != null ? linkDoc.getString("utm_campaign") : null;
        String utm_term = linkDoc != null ? linkDoc.getString("utm_term") : null;
        String utm_content = linkDoc != null ? linkDoc.getString("utm_content") : null;

        // Build a new Click record.
        Click click = new Click();
        // Use the _id from 'links' if available, otherwise fallback to UrlMapping _id
        click.setLinkId(linkId != null ? linkId : mapping.get_id());
        System.out.println("Click linkId: " + click.getLinkId().toHexString());
        click.setUserId(mapping.getUserId()); // From UrlMapping, assuming it's populated
        click.setReferrer(referrer);
        click.setIp(ipAddress);
        click.setUserAgent(userAgent);
        click.setCountry(geoData.getOrDefault("country", "Unknown"));
        click.setRegion(geoData.getOrDefault("region", "Unknown"));
        click.setCity(geoData.getOrDefault("city", "Unknown"));
        click.setPostal(geoData.getOrDefault("postal", "unknown"));
        click.setLatitude(Double.parseDouble(geoData.getOrDefault("latitude", "0")));
        click.setLongitude(Double.parseDouble(geoData.getOrDefault("longitude", "0")));
        // Set UTM parameters retrieved from the link document.
        click.setUtm_source(utm_source);
        click.setUtm_medium(utm_medium);
        click.setUtm_campaign(utm_campaign);
        click.setUtm_term(utm_term);
        click.setUtm_content(utm_content);

        // Log the click asynchronously.
        asyncClickService.logClick(click);

        // Redirect to the original URL.
        return new RedirectView(mapping.getOriginalUrl());
    }

    private Map<String, String> getGeoLocation(String ipAddress) {
        CacheEntry entry = geoCache.get(ipAddress);
        if (entry != null && !entry.isExpired()) {
            System.out.println("[GeoLookup] Using cached geo data for IP: " + ipAddress);
            return entry.getGeoData();
        }
        Map<String, String> geoData = new HashMap<>();
        try {
            // Use the IPinfo library with its builder API.
            IPinfo ipInfo = new IPinfo.Builder().setToken(ipinfoToken).build();
            IPResponse response = ipInfo.lookupIP(ipAddress);
            System.out.println("[GeoLookup] IPinfo response: " + response);
            if (response != null) {
                // Adjust these getters if your version of IPResponse uses different names
                geoData.put("country", response.getCountryCode() != null ? response.getCountryCode() : "Unknown");
                geoData.put("region", response.getRegion() != null ? response.getRegion() : "Unknown");
                geoData.put("city", response.getCity() != null ? response.getCity() : "Unknown");
                geoData.put("postal", response.getPostal() != null ? response.getPostal() : "Unknown");
                geoData.put("latitude", response.getLatitude() != null ? response.getLatitude() : "Unknown");
                geoData.put("longitude", response.getLongitude() != null ? response.getLongitude() : "Unknown");
            } else {
                System.out.println("[GeoLookup] IPinfo response was null for IP: " + ipAddress);
                geoData.put("country", "Unknown");
                geoData.put("region", "Unknown");
                geoData.put("city", "Unknown");
                geoData.put("postal", "Unknown");
                geoData.put("latitude", "Unknown");
                geoData.put("longitude", "Unknown");
            }
        } catch (Exception e) { // Catch any exceptions (e.g. rate limiting)
            System.err.println(
                    "[GeoLookup] Exception while fetching geo data for IP " + ipAddress + ": " + e.getMessage());
            e.printStackTrace();
            geoData.put("country", "Unknown");
            geoData.put("region", "Unknown");
            geoData.put("city", "Unknown");
            geoData.put("postal", "Unknown");
            geoData.put("latitude", "Unknown");
            geoData.put("longitude", "Unknown");
        }
        geoCache.put(ipAddress, new CacheEntry(geoData, System.currentTimeMillis()));
        System.out.println("[GeoLookup] Cached geo data for IP " + ipAddress + ": " + geoData);
        return geoData;
    }

    // Helper class for caching geolocation data.
    private static class CacheEntry {
        private final Map<String, String> geoData;
        private final long timestamp;

        public CacheEntry(Map<String, String> geoData, long timestamp) {
            this.geoData = geoData;
            this.timestamp = timestamp;
        }

        public boolean isExpired() {
            return System.currentTimeMillis() - timestamp > CACHE_TTL_MS;
        }

        public Map<String, String> getGeoData() {
            return geoData;
        }
    }
}