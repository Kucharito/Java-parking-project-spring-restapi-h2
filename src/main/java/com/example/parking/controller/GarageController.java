// src/main/java/com/example/parking/controller/GarageController.java
package com.example.parking.controller;

import com.example.parking.domain.Garage;
import com.example.parking.service.GarageService;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/garages")
@RequiredArgsConstructor
public class GarageController {
    private final GarageService service;

    @GetMapping
    public List<Garage> list() {
        return service.getAllGarages();
    }

    @PostMapping
    public ResponseEntity<Garage> create(@RequestParam @NotBlank String name) {
        Garage created = service.create(name);
        return ResponseEntity
                .created(URI.create("/api/garages/" + created.getId()))
                .body(created);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        // Deletion logic to be implemented in the service layer
        service.deleteGarage(id);
        return ResponseEntity.noContent().build();
    }
}
