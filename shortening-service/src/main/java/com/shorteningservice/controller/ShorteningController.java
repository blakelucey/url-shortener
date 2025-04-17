package com.shorteningservice.controller;

import com.shorteningservice.model.UrlMapping;
import com.shorteningservice.repository.UrlMappingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Value;

import java.util.Map;
import java.util.Random;

@RestController
@CrossOrigin(origins = "${NEXT_PUBLIC_FRONTEND_URL}")
public class ShorteningController {

    @Autowired
    private UrlMappingRepository repository;

     @Value("${NEXT_PUBLIC_REDIRECTION_URL}")
    private String redirectionUrl;

    @PostMapping("/shorten")
    public Map<String, String> shortenUrl(@RequestBody Map<String, String> request) {
        String originalUrl = request.get("url");
        String userId = request.get("userId");

        if (originalUrl == null || originalUrl.trim().isEmpty()) {
            throw new IllegalArgumentException("URL cannot be empty");
        }

        // Generate a globally unique short code.
        String shortHash = generateUniqueShortHash();
        UrlMapping mapping = new UrlMapping(userId, shortHash, originalUrl);
        repository.save(mapping);

        String shortUrl = redirectionUrl + "/" + shortHash;
        Map<String, String> response = Map.of("shortUrl", shortUrl, "shortHash", shortHash);
        return response;
    }

    private String generateUniqueShortHash() {
        String chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random random = new Random();
        String shortHash;
        int length = 6;

        do {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < length; i++) {
                sb.append(chars.charAt(random.nextInt(chars.length())));
            }
            shortHash = sb.toString();
        } while (repository.existsByShortHash(shortHash)); // Global uniqueness check

        return shortHash;
    }
}