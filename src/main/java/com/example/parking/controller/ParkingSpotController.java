package com.example.parking.controller;

import com.example.parking.domain.ParkingSpot;
import com.example.parking.service.ParkingSpotService;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/parkingspots")
@RequiredArgsConstructor
public class ParkingSpotController {
    private final ParkingSpotService service;

    @GetMapping
    public List<ParkingSpot> spotList(@RequestParam @NotNull Long garageId) {
        return service.getAllSpots(garageId);
    }

    @PostMapping
    public ParkingSpot create(@RequestParam @NotNull Long garageId,@RequestParam @NotBlank String spotNumber, @RequestParam @NotBlank String type) {
        var created = service.create(garageId, spotNumber, type);
        return ResponseEntity.created(URI.create("/api/parkingspots/" + created.getId())).body(created).getBody();

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        service.deleteSpot(id);
        return ResponseEntity.noContent().build();
    }

}
