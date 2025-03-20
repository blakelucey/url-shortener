// src/main/java/com/example/redirectionservice/config/AppConfig.java
package com.example.redirectionservice.config;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;

@Configuration
@EnableAsync
@EnableCaching
public class AppConfig {
    // You can add additional bean definitions here if needed.
}