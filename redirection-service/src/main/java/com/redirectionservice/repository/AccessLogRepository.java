// src/main/java/com/example/redirectionservice/repository/AccessLogRepository.java
package com.example.redirectionservice.repository;

import com.example.redirectionservice.model.AccessLog;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AccessLogRepository extends MongoRepository<AccessLog, String> {
}