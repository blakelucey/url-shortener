// src/main/java/com/example/shorteningservice/repository/UrlMappingRepository.java
package com.shorteningservice.repository;

import com.shorteningservice.model.UrlMapping;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UrlMappingRepository extends MongoRepository<UrlMapping, String> {
    UrlMapping findByShortHash(String shortHash);
    boolean existsByShortHash(String shortHash);
}