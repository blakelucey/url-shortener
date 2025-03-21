// src/main/java/com/example/redirectionservice/repository/UrlMappingRepository.java
package com.redirectionservice.repository;

import com.redirectionservice.model.UrlMapping;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UrlMappingRepository extends MongoRepository<UrlMapping, String> {
    UrlMapping findByShortHash(String shortHash);
}