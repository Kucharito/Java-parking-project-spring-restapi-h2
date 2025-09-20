package com.example.parking.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {
    @Operation(summary = "Hello endpoint", description = "jendoduchy smoke test")
    @GetMapping("/api/hello")
    public String hello(
            @Parameter(description = "Meno pre pozdrav")
            @RequestParam(defaultValue = "world") String name) {
        return "Hello, " + name + "!";
    }

}
