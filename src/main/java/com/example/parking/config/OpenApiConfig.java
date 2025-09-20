package com.example.parking.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@OpenAPIDefinition(info = @Info(
        title = "Parking API",
        version = "v1",
        description = "Demo REST API pre garazove aplikacie"
)
)
@Configuration
public class OpenApiConfig {
}
