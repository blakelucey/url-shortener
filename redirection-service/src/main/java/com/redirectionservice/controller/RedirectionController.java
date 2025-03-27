// src/main/java/com/example/redirectionservice/controller/RedirectionController.java
package com.redirectionservice.controller;

import com.redirectionservice.model.Click;
import com.redirectionservice.model.UrlMapping;
import com.redirectionservice.repository.UrlMappingRepository;
import com.redirectionservice.service.AsyncClickService;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.view.RedirectView;

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

    // In-memory cache for geolocation data keyed by IP address.
    private static final ConcurrentHashMap<String, CacheEntry> geoCache = new ConcurrentHashMap<>();
    // Cache TTL: 1 hour.
    private static final long CACHE_TTL_MS = TimeUnit.HOURS.toMillis(1);

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

        // Extract request data.
        String userAgent = request.getHeader("User-Agent");
        String ipAddress = request.getRemoteAddr();
        String referrer = request.getHeader("Referer") != null ? request.getHeader("Referer") : "Direct";

        // Retrieve geolocation data.
        Map<String, String> geoData = getGeoLocation(ipAddress);

        // Extract UTM parameters from the link document.
        // (Assuming the document keys match exactly, e.g., "utm_source", "utm_medium", etc.)
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
            return entry.getGeoData();
        }
        Map<String, String> geoData = new HashMap<>();
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "http://ip-api.com/json/" + ipAddress;
            Map response = restTemplate.getForObject(url, Map.class);
            if (response != null) {
                geoData.put("country", (String) response.getOrDefault("country", "Unknown"));
                geoData.put("region", (String) response.getOrDefault("regionName", "Unknown"));
                geoData.put("city", (String) response.getOrDefault("city", "Unknown"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            geoData.put("country", "Unknown");
            geoData.put("region", "Unknown");
            geoData.put("city", "Unknown");
        }
        geoCache.put(ipAddress, new CacheEntry(geoData, System.currentTimeMillis()));
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