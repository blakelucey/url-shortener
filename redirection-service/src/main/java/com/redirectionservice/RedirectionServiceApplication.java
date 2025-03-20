// src/main/java/com/example/redirectionservice/RedirectionServiceApplication.java
package com.example.redirectionservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class RedirectionServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(RedirectionServiceApplication.class, args);
    }
}