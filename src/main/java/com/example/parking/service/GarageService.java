// src/main/java/com/example/parking/service/GarageService.java
package com.example.parking.service;

import com.example.parking.domain.Garage;
import com.example.parking.repo.GarageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GarageService {
    private final GarageRepository repo;

    public List<Garage> getAllGarages() {
        return repo.findAll();
    }

    public Garage create(String name) {
        repo.findByNameIgnoreCase(name).ifPresent(g -> {
            throw new IllegalArgumentException("Garage with name " + name + " already exists");
        });
        return repo.save(Garage.builder().name(name).build());
    }
}
