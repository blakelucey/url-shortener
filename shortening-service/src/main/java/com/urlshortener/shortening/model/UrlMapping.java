// src/main/java/com/example/shorteningservice/model/UrlMapping.java
package com.shorteningservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.bson.types.ObjectId;

import java.util.Date;

@Document(collection = "url_mappings")
public class UrlMapping {
    @Id
    private ObjectId _id;
    private String userId;       // Added field for the user ID
    private String shortHash;
    private String originalUrl;
    private Date createdAt;

    // Default constructor
    public UrlMapping() {
        this.createdAt = new Date();
    }

    // Update the constructor to accept userId as well
    public UrlMapping(String userId, String shortHash, String originalUrl) {
        this.userId = userId;
        this.shortHash = shortHash;
        this.originalUrl = originalUrl;
        this.createdAt = new Date();
    }

    // Getters and Setters
    public ObjectId getId() {
        return _id;
    }

    public void setId(ObjectId id) {
        this._id = id;
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