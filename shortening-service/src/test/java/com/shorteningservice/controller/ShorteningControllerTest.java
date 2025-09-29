package com.shorteningservice.controller;

import com.shorteningservice.model.UrlMapping;
import com.shorteningservice.repository.UrlMappingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Field;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ShorteningControllerTest {

    @Mock
    private UrlMappingRepository repository;

    @InjectMocks
    private ShorteningController controller;

    @BeforeEach
    void setUp() throws Exception {
        Field redirectField = ShorteningController.class.getDeclaredField("redirectionUrl");
        redirectField.setAccessible(true);
        redirectField.set(controller, "https://kliqly.link/go");
    }

    @Test
    void shortenUrl_persistsMappingAndReturnsShortLink() {
        when(repository.existsByShortHash(anyString())).thenReturn(false);

        Map<String, String> response = controller.shortenUrl(Map.of(
                "url", "https://example.com",
                "userId", "user-123"
        ));

        assertEquals(2, response.size());
        assertTrue(response.get("shortUrl").startsWith("https://kliqly.link/go/"));
        assertEquals(6, response.get("shortHash").length());

        ArgumentCaptor<UrlMapping> captor = ArgumentCaptor.forClass(UrlMapping.class);
        verify(repository).save(captor.capture());
        UrlMapping saved = captor.getValue();
        assertEquals("user-123", saved.getUserId());
        assertEquals("https://example.com", saved.getOriginalUrl());
        assertEquals(response.get("shortHash"), saved.getShortHash());
    }

    @Test
    void shortenUrl_retriesWhenHashCollisionOccurs() {
        when(repository.existsByShortHash(anyString()))
                .thenReturn(true)  // first attempt collides
                .thenReturn(false); // second is unique

        controller.shortenUrl(Map.of(
                "url", "https://example.com",
                "userId", "user-123"
        ));

        verify(repository, times(2)).existsByShortHash(anyString());
        verify(repository).save(any(UrlMapping.class));
    }

    @Test
    void shortenUrl_throwsWhenUrlMissing() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
                controller.shortenUrl(Map.of("userId", "user-123"))
        );

        assertEquals("URL cannot be empty", exception.getMessage());
        verify(repository, never()).save(any());
    }
}
