package com.redirectionservice.service;

import com.redirectionservice.model.Click;
import com.redirectionservice.repository.ClickRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class AsyncClickServiceTest {

    @Mock
    private ClickRepository clickRepository;

    @InjectMocks
    private AsyncClickService asyncClickService;

    @Test
    void logClick_persistsClickRecord() {
        Click click = new Click();

        asyncClickService.logClick(click);

        verify(clickRepository).save(click);
    }
}
