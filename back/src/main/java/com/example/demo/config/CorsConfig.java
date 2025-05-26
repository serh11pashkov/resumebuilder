package com.example.demo.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    private static final Logger logger = LoggerFactory.getLogger(CorsConfig.class);

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        logger.info("Initializing CORS configuration with WebMvcConfigurer");
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                logger.info("Setting up CORS mappings");
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true)
                        .maxAge(3600);
                logger.info("CORS mappings configured successfully");
            }
        };
    }

    @Bean
    public CorsFilter corsFilter() {
        logger.info("Initializing enhanced CORS filter");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        // Allow cookies and credentials
        config.setAllowCredentials(true);

        // Allow specific origins
        config.addAllowedOrigin("http://localhost:3000"); // Frontend URL
        logger.info("Allowing origin: http://localhost:3000");

        // Allow common HTTP methods
        config.addAllowedMethod("GET");
        config.addAllowedMethod("POST");
        config.addAllowedMethod("PUT");
        config.addAllowedMethod("DELETE");
        config.addAllowedMethod("OPTIONS");
        logger.info("Allowed methods: GET, POST, PUT, DELETE, OPTIONS");

        // Allow all headers
        config.addAllowedHeader("*");
        // Allow Authorization header in response
        config.addExposedHeader("Authorization");
        logger.info("Allowing all headers and exposing Authorization header");

        // Set max age for preflight requests
        config.setMaxAge(3600L);
        logger.info("Setting max age: 3600 seconds");

        // Add the configuration to all paths
        source.registerCorsConfiguration("/**", config);
        logger.info("Enhanced CORS configuration applied to all paths");

        return new CorsFilter(source);
    }
}
