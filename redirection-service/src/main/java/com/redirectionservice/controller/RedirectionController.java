// src/main/java/com/example/redirectionservice/controller/RedirectionController.java
package com.example.redirectionservice.controller;

import com.example.redirectionservice.model.AccessLog;
import com.example.redirectionservice.model.UrlMapping;
import com.example.redirectionservice.repository.AccessLogRepository;
import com.example.redirectionservice.repository.UrlMappingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.view.RedirectView;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
public class RedirectionController {

    @Autowired
    private UrlMappingRepository urlRepository;

    @Autowired
    private AccessLogRepository logRepository;

    @GetMapping("/{shortCode}")
    public RedirectView redirect(@PathVariable String shortCode, HttpServletRequest request) {
        UrlMapping mapping = urlRepository.findByShortCode(shortCode);
        if (mapping != null) {
            // Extract request data for analytics
            String userAgent = request.getHeader("User-Agent");
            String ipAddress = request.getRemoteAddr();
            String referrer = request.getHeader("Referer") != null ? request.getHeader("Referer") : "Direct";

            // Get geolocation data from ipinfo.io
            Map<String, String> geoData = getGeoLocation(ipAddress);

            // Create and save access log
            AccessLog log = new AccessLog(shortCode, userAgent, ipAddress, referrer);
            log.setCountry(geoData.getOrDefault("country", "Unknown"));
            log.setRegion(geoData.getOrDefault("region", "Unknown"));
            log.setCity(geoData.getOrDefault("city", "Unknown"));
            logRepository.save(log);

            // Redirect to the original URL
            return new RedirectView(mapping.getLongUrl());
        } else {
            return new RedirectView("/404"); // Handle invalid short codes
        }
    }

    // New method that uses ipinfo.io for geolocation
    private Map<String, String> getGeoLocation(String ipAddress) {
        Map<String, String> geoData = new HashMap<>();
        try {
            RestTemplate restTemplate = new RestTemplate();
            // If you have an ipinfo.io token, set it here; otherwise, leave token as empty
            String token = "YOUR_IPINFO_TOKEN"; // Replace with your token or leave as "" if not using one
            String url = "https://ipinfo.io/" + ipAddress + "/json";
            if (token != null && !token.isEmpty()) {
                url += "?token=" + token;
            }

            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> data = response.getBody();
                String country = (String) data.getOrDefault("country", "Unknown");
                // ipinfo.io returns "region" (the full region name) instead of "regionName"
                String region = (String) data.getOrDefault("region", "Unknown");
                String city = (String) data.getOrDefault("city", "Unknown");

                geoData.put("country", country);
                geoData.put("region", region);
                geoData.put("city", city);
            }
        } catch (Exception e) {
            // Log the exception as needed
            e.printStackTrace();
            geoData.put("country", "Unknown");
            geoData.put("region", "Unknown");
            geoData.put("city", "Unknown");
        }
        return geoData;
    }
}