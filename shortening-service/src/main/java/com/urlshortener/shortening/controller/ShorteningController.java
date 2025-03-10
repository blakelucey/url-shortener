package com.example.shorteningservice.controller;

import com.example.shorteningservice.model.UrlMapping;
import com.example.shorteningservice.repository.UrlMappingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Random;

@RestController
@CrossOrigin(origins = "${NEXT_PUBLIC_FRONTEND_URL}") // Add this
public class ShorteningController {

    @Autowired
    private UrlMappingRepository repository;

    @PostMapping("/shorten")
    public Map<String, String> shortenUrl(@RequestBody Map<String, String> request) {
        String longUrl = request.get("url");
        if (longUrl == null || longUrl.trim().isEmpty()) {
            throw new IllegalArgumentException("URL cannot be empty");
        }

        String shortCode = generateUniqueShortCode();
        UrlMapping mapping = new UrlMapping(shortCode, longUrl);
        repository.save(mapping);

        String shortUrl = "http://short-ly.link/" + shortCode; // Adjust base URL for production
        return Map.of("shortUrl", shortUrl);
    }

    private String generateUniqueShortCode() {
        String chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        int length = 6;

        do {
            sb.setLength(0);
            for (int i = 0; i < length; i++) {
                sb.append(chars.charAt(random.nextInt(chars.length())));
            }
        } while (repository.existsByShortCode(sb.toString()));

        return sb.toString();
    }
}