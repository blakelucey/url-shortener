// src/main/java/com/example/redirectionservice/repository/UrlMappingRepository.java
package com.example.redirectionservice.repository;

import com.example.redirectionservice.model.UrlMapping;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UrlMappingRepository extends MongoRepository<UrlMapping, String> {
    UrlMapping findByShortCode(String shortCode);
}