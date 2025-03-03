// src/main/java/com/example/redirectionservice/controller/RedirectionController.java
package com.example.redirectionservice.controller;

import com.example.redirectionservice.model.AccessLog;
import com.example.redirectionservice.model.UrlMapping;
import com.example.redirectionservice.repository.AccessLogRepository;
import com.example.redirectionservice.repository.UrlMappingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
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

            // Simulate geolocation (replace with actual geolocation service in production)
            Map<String, String> geoData = getGeoLocation(ipAddress);

            // Create and save access log
            AccessLog log = new AccessLog(shortCode, userAgent, ipAddress, referrer);
            log.setCountry(geoData.getOrDefault("country", "Unknown"));
            log.setCity(geoData.getOrDefault("city", "Unknown"));
            logRepository.save(log);

            // Redirect to the original URL
            return new RedirectView(mapping.getLongUrl());
        } else {
            return new RedirectView("/404"); // Handle invalid short codes
        }
    }

    // Simulated geolocation method (replace with real service like MaxMind GeoIP2)
    private Map<String, String> getGeoLocation(String ipAddress) {
        Map<String, String> geoData = new HashMap<>();
        // For demonstration purposes only
        if ("127.0.0.1".equals(ipAddress)) {
            geoData.put("country", "Localhost");
            geoData.put("city", "Unknown");
        } else {
            geoData.put("country", "SampleCountry");
            geoData.put("city", "SampleCity");
        }
        return geoData;
    }
}