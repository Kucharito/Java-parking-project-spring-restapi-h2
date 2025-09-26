package com.example.parking.controller;

import com.example.parking.domain.ParkingSpot;
import com.example.parking.dto.AvailabityDtos;
import com.example.parking.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.OffsetDateTime;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AvailabilityController {
    private final ReservationService reservationService;

    @GetMapping("/availability")
    public List<AvailabityDtos> availabityDtosList (@RequestParam Long garageId, @RequestParam OffsetDateTime start, @RequestParam OffsetDateTime end){
        return reservationService.findAvailableSpots(garageId, start, end).stream()
                .map(this::toDto)
                .toList();
    }

    private AvailabityDtos toDto(ParkingSpot spot){
        return AvailabityDtos.builder()
                .id(spot.getId())
                .number(spot.getSpotNumber())
                .type(spot.getType().name())
                .build();
    }
}
