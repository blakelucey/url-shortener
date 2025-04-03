package com.shorteningservice;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.File;

@SpringBootApplication
public class ShorteningServiceApplication {

    public static void main(String[] args) {
        // Define the directory and filename that Dotenv should load.
        // In your case, the .env file is one level up.
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
        
        SpringApplication.run(ShorteningServiceApplication.class, args);
    }
}