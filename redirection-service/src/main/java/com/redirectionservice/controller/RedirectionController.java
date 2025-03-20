// src/main/java/com/example/redirectionservice/controller/RedirectionController.java
package com.example.redirectionservice.controller;

import com.example.redirectionservice.model.Click;
import com.example.redirectionservice.model.UrlMapping;
import com.example.redirectionservice.repository.UrlMappingRepository;
import com.example.redirectionservice.service.AsyncClickService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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

    // In-memory cache for geolocation data keyed by IP address.
    private static final ConcurrentHashMap<String, CacheEntry> geoCache = new ConcurrentHashMap<>();
    // Cache TTL: 1 hour.
    private static final long CACHE_TTL_MS = TimeUnit.HOURS.toMillis(1);

    @GetMapping("/{shortHash}")
    public RedirectView redirect(@PathVariable String shortHash, HttpServletRequest request) {
        // Retrieve the URL mapping by short code.
        UrlMapping mapping = urlRepository.findByShortHash(shortHash);
        System.out.println("Redirect request for short code: " + shortHash);
        if (mapping == null) {
            System.out.println("No URL mapping found for: " + shortHash);
            return new RedirectView("/404");
        }

        // Extract request data for analytics.
        String userAgent = request.getHeader("User-Agent");
        String ipAddress = request.getRemoteAddr();
        String referrer = (request.getHeader("Referer") != null) ? request.getHeader("Referer") : "Direct";

        // (Optionally) extract UTM parameters from the query string.
        // For example, if the redirect URL is appended with utm_source, utm_medium, etc.
        String utm_source = request.getParameter("utm_source");
        String utm_medium = request.getParameter("utm_medium");
        String utm_campaign = request.getParameter("utm_campaign");
        String utm_term = request.getParameter("utm_term");
        String utm_content = request.getParameter("utm_content");

        // Retrieve geolocation data using caching.
        Map<String, String> geoData = getGeoLocation(ipAddress);

        // Build a new Click record.
        Click click = new Click();
        click.setLinkId(mapping.getId().toString());
        // Set the userId from the URL mapping (ensure that your link creation process populates this field).
        click.setUserId(mapping.getUserId());
        click.setReferrer(referrer);
        click.setIp(ipAddress);
        click.setUserAgent(userAgent);
        click.setCountry(geoData.getOrDefault("country", "Unknown"));
        click.setRegion(geoData.getOrDefault("region", "Unknown"));
        click.setCity(geoData.getOrDefault("city", "Unknown"));
        // Optionally set UTM parameters if they are present.
        click.setUtm_source(utm_source);
        click.setUtm_medium(utm_medium);
        click.setUtm_campaign(utm_campaign);
        click.setUtm_term(utm_term);
        click.setUtm_content(utm_content);
        // Optionally, you can also set deviceType, browser, and operatingSystem if you parse those from the user-agent.

        // Log the click asynchronously so the redirect is not delayed.
        asyncClickService.logClick(click);

        // Redirect to the original long URL.
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
            // Using a free endpoint (ip-api.com) that does not require an API token.
            String url = "http://ip-api.com/json/" + ipAddress;
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> data = response.getBody();
                String country = (String) data.getOrDefault("country", "Unknown");
                String region = (String) data.getOrDefault("regionName", "Unknown"); // ip-api.com uses "regionName"
                String city = (String) data.getOrDefault("city", "Unknown");
                geoData.put("country", country);
                geoData.put("region", region);
                geoData.put("city", city);
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