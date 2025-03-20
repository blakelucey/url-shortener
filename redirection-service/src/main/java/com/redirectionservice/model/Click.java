// src/main/java/com/example/redirectionservice/model/Click.java
package com.example.redirectionservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "clicks")
public class Click {
    @Id
    private String id;

    // The link this click belongs to – we store it as an ObjectId (here as String)
    private String linkId;

    // Index userId for fast lookup
    @Indexed
    private String userId;

    private Date timestamp = new Date();

    private String referrer;
    private String ip;
    private String userAgent;
    private String deviceType;
    private String browser;
    private String operatingSystem;
    private String country;
    private String region;
    private String city;
    private String utm_source;
    private String utm_medium;
    private String utm_campaign;
    private String utm_term;
    private String utm_content;

    // Constructors, getters and setters

    public Click() {}

    public Click(String linkId, String userId, String referrer, String ip, String userAgent) {
        this.linkId = linkId;
        this.userId = userId;
        this.referrer = referrer;
        this.ip = ip;
        this.userAgent = userAgent;
    }

    // ... getters and setters for all fields ...

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getLinkId() { return linkId; }
    public void setLinkId(String linkId) { this.linkId = linkId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public Date getTimestamp() { return timestamp; }
    public void setTimestamp(Date timestamp) { this.timestamp = timestamp; }

    public String getReferrer() { return referrer; }
    public void setReferrer(String referrer) { this.referrer = referrer; }

    public String getIp() { return ip; }
    public void setIp(String ip) { this.ip = ip; }

    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }

    public String getDeviceType() { return deviceType; }
    public void setDeviceType(String deviceType) { this.deviceType = deviceType; }

    public String getBrowser() { return browser; }
    public void setBrowser(String browser) { this.browser = browser; }

    public String getOperatingSystem() { return operatingSystem; }
    public void setOperatingSystem(String operatingSystem) { this.operatingSystem = operatingSystem; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getUtm_source() { return utm_source; }
    public void setUtm_source(String utm_source) { this.utm_source = utm_source; }

    public String getUtm_medium() { return utm_medium; }
    public void setUtm_medium(String utm_medium) { this.utm_medium = utm_medium; }

    public String getUtm_campaign() { return utm_campaign; }
    public void setUtm_campaign(String utm_campaign) { this.utm_campaign = utm_campaign; }

    public String getUtm_term() { return utm_term; }
    public void setUtm_term(String utm_term) { this.utm_term = utm_term; }

    public String getUtm_content() { return utm_content; }
    public void setUtm_content(String utm_content) { this.utm_content = utm_content; }
}