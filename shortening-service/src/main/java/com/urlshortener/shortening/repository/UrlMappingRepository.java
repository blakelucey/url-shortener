// src/main/java/com/example/shorteningservice/repository/UrlMappingRepository.java
package com.example.shorteningservice.repository;

import com.example.shorteningservice.model.UrlMapping;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UrlMappingRepository extends MongoRepository<UrlMapping, String> {
    UrlMapping findByShortCode(String shortCode);
    boolean existsByShortCode(String shortCode);
}