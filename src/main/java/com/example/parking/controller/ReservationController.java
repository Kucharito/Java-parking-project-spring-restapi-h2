package com.example.parking.controller;

import com.example.parking.domain.Reservation;
import com.example.parking.dto.ReservationDtos;
import com.example.parking.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.OffsetDateTime;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {
    private final ReservationService service;

    @PostMapping
    public ResponseEntity<ReservationDtos.Response> create(@Valid @RequestBody ReservationDtos.CreateRequest req) {
        var r = service.create(req.getSpotId(), req.getLicensePlate(), req.getStartTime(), req.getEndTime());
        return ResponseEntity.created(URI.create("/api/reservations/" + r.getId())).body(toDto(r));
    }

    @GetMapping("/{id}")
    public ReservationDtos.Response getById(@PathVariable Long id) {
        return toDto(service.get(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancel(@PathVariable Long id) {
        service.cancel(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/check-in")
    public ReservationDtos.Response checkIn(@PathVariable Long id, @RequestParam(required = false) @DateTimeFormat (iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime now) {
        return toDto(service.checkIn(id,now));
    }

    @PostMapping("/{id}/check-out")
    public ReservationDtos.Response checkOut(@PathVariable Long id, @RequestParam(required = false) @DateTimeFormat (iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime now) {
        return toDto(service.checkOut(id,now));
    }

    private ReservationDtos.Response toDto(Reservation r){
        return ReservationDtos.Response.builder()
                .id(r.getId())
                .spotId(r.getParkingSpot().getId())
                .spotNumber(r.getParkingSpot().getSpotNumber())
                .licensePlate(r.getLicensePlate())
                .startTime(r.getStartTime())
                .endTime(r.getEndTime())
                .status(r.getStatus().name())
                .build();
    }

}
