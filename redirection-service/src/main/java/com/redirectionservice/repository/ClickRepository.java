// src/main/java/com/example/redirectionservice/repository/ClickRepository.java
package com.example.redirectionservice.repository;

import com.example.redirectionservice.model.Click;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ClickRepository extends MongoRepository<Click, String> {
    // You can add custom query methods if needed
}