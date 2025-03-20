// src/main/java/com/example/shorteningservice/model/UrlMapping.java
package com.example.shorteningservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "url_mappings")
public class UrlMapping {
    @Id
    private String id;
    private String userId;       // Added field for the user ID
    private String shortCode;
    private String originalUrl;
    private Date createdAt;

    // Default constructor
    public UrlMapping() {
        this.createdAt = new Date();
    }

    // Update the constructor to accept userId as well
    public UrlMapping(String userId, String shortCode, String originalUrl) {
        this.userId = userId;
        this.shortCode = shortCode;
        this.originalUrl = originalUrl;
        this.createdAt = new Date();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getShortCode() {
        return shortCode;
    }

    public void setShortCode(String shortCode) {
        this.shortCode = shortCode;
    }

    public String getOriginalUrl() {
        return originalUrl;
    }

    public void setOriginalUrl(String originalUrl) {
        this.originalUrl = originalUrl;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}