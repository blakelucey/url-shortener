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
    private String shortCode;
    private String longUrl;
    private Date createdAt;

    public UrlMapping() {
        this.createdAt = new Date();
    }

    public UrlMapping(String userId, String shortCode, String longUrl) {
        this.userId = userId;
        this.shortCode = shortCode;
        this.longUrl = longUrl;
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
    public String getLongUrl() {
        return longUrl;
    }
    public void setLongUrl(String longUrl) {
        this.longUrl = longUrl;
    }
    public Date getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}