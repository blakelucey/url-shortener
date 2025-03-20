// src/main/java/com/example/redirectionservice/model/UrlMapping.java
package com.example.redirectionservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "url_mappings")
public class UrlMapping {
    @Id
    private String id;
    private String userId;       // added so we know which user owns this link
    private String shortHash;
    private String originalUrl;
    private Date createdAt;

    public UrlMapping() {
        this.createdAt = new Date();
    }

    public UrlMapping(String userId, String shortHash, String originalUrl) {
        this.userId = userId;
        this.shortHash = shortHash;
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
    public String getShortHash() {
        return shortHash;
    }
    public void setShortHash(String shortHash) {
        this.shortHash = shortHash;
    }
    public String getOriginalUrl() {
        return originalUrl;
    }
    public void setoriginalUrl(String originalUrl) {
        this.originalUrl = originalUrl;
    }
    public Date getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}