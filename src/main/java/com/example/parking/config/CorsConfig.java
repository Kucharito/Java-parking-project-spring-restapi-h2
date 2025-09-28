package com.example.parking.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins(
                                "http://localhost:60702",  // IntelliJ preview
                                "http://localhost:5173",   // (ak budeš mať Vite/React)
                                "http://127.0.0.1:60702",
                                "http://127.0.0.1:5173"
                        )
                        .allowedMethods("GET","POST","PUT","DELETE","OPTIONS")
                        .allowedHeaders("*");
            }
        };
    }
}
