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
    private String region;
    private String city;     // Geolocation data

    // New fields for analytics:
    private String userId;        // which user owns the link
    private String utmSource;
    private String utmMedium;
    private String utmCampaign;
    private String utmTerm;
    private String utmContent;

    public AccessLog() {
        this.timestamp = new Date();
    }

    // Optionally, you can add a constructor if you prefer:
    public AccessLog(String shortCode, String userAgent, String ipAddress, String referrer) {
        this.shortCode = shortCode;
        this.userAgent = userAgent;
        this.ipAddress = ipAddress;
        this.referrer = referrer;
        this.timestamp = new Date();
    }

    // Getters and setters for all fields:
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getShortCode() { return shortCode; }
    public void setShortCode(String shortCode) { this.shortCode = shortCode; }
    public Date getTimestamp() { return timestamp; }
    public void setTimestamp(Date timestamp) { this.timestamp = timestamp; }
    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    public String getReferrer() { return referrer; }
    public void setReferrer(String referrer) { this.referrer = referrer; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public String getRegion() {return region;}
    public void setRegion(String region){this.region = region;}
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getUtmSource() { return utmSource; }
    public void setUtmSource(String utmSource) { this.utmSource = utmSource; }
    public String getUtmMedium() { return utmMedium; }
    public void setUtmMedium(String utmMedium) { this.utmMedium = utmMedium; }
    public String getUtmCampaign() { return utmCampaign; }
    public void setUtmCampaign(String utmCampaign) { this.utmCampaign = utmCampaign; }
    public String getUtmTerm() { return utmTerm; }
    public void setUtmTerm(String utmTerm) { this.utmTerm = utmTerm; }
    public String getUtmContent() { return utmContent; }
    public void setUtmContent(String utmContent) { this.utmContent = utmContent; }
}