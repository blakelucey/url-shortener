// src/main/java/com/example/redirectionservice/model/AccessLog.java
package com.example.redirectionservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "access_logs")
public class AccessLog {
    @Id
    private String id;
    private String shortCode;
    private Date timestamp;
    private String userAgent;
    private String ipAddress;
    private String referrer;
    private String country;  // Geolocation data
    private String city;     // Geolocation data

    // Constructors
    public AccessLog() {
        this.timestamp = new Date();
    }

    public AccessLog(String shortCode, String userAgent, String ipAddress, String referrer) {
        this.shortCode = shortCode;
        this.userAgent = userAgent;
        this.ipAddress = ipAddress;
        this.referrer = referrer;
        this.timestamp = new Date();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getShortCode() {
        return shortCode;
    }

    public void setShortCode(String shortCode) {
        this.shortCode = shortCode;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getReferrer() {
        return referrer;
    }

    public void setReferrer(String referrer) {
        this.referrer = referrer;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }
}