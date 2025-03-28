// src/main/java/com/example/redirectionservice/RedirectionServiceApplication.java
package com.redirectionservice;

import io.github.cdimascio.dotenv.Dotenv;
import java.io.File;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class RedirectionServiceApplication {
    public static void main(String[] args) {
        String dotenvDirectory = "/Users/blakelucey/Desktop/Coding/development/my-url-shortener/.env";
        String dotenvFilename = ".env";

        // Build the absolute path to the .env file
        File envFile = new File(System.getProperty("user.dir"), dotenvDirectory);
        System.out.println("Looking for .env file at: " + envFile.getAbsolutePath());
        System.out.println("File exists: " + envFile.exists());

        // Load the .env file from the specified directory
        Dotenv dotenv = Dotenv.configure()
                              .directory(dotenvDirectory)
                              .filename(dotenvFilename)
                              .ignoreIfMissing()
                              .load();

        // Optionally print out the loaded entries for debugging
        dotenv.entries().forEach(entry ->
            System.out.println("Loaded " + entry.getKey() + "=" + entry.getValue())
        );

        // Register each .env entry as a system property
        dotenv.entries().forEach(entry ->
            System.setProperty(entry.getKey(), entry.getValue())
        );

        SpringApplication.run(RedirectionServiceApplication.class, args);
    }
}