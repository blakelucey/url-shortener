// src/main/java/com/example/redirectionservice/service/AsyncClickService.java
package com.redirectionservice.service;

import com.redirectionservice.model.Click;
import com.redirectionservice.repository.ClickRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class AsyncClickService {

    @Autowired
    private ClickRepository clickRepository;

    @Async
    public void logClick(Click click) {
        clickRepository.save(click);
    }
}