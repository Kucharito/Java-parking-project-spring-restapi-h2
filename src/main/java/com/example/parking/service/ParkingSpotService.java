package com.example.parking.service;

import com.example.parking.domain.Garage;
import com.example.parking.domain.ParkingSpot;
import com.example.parking.repo.GarageRepository;
import com.example.parking.repo.ParkingSpotRepository;
import org.springframework.transaction.annotation.Transactional;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ParkingSpotService {
    private final ParkingSpotRepository spotsRepo;
    private final GarageRepository garageRepo;

    @Transactional(readOnly = true)
    public List<ParkingSpot> getAllSpots(Long garageId) {
        garageRepo.findById(garageId).orElseThrow(() -> new IllegalArgumentException("Garage with id " + garageId + " not found"));
        return spotsRepo.findByGarageId(garageId);
    }

    @Transactional
    public ParkingSpot create(Long garageId, String spotNumber, @NotBlank String type) {
        if(spotNumber == null || spotNumber.isBlank()) {
            throw new IllegalArgumentException("Spot number cannot be blank");
        }
        String number = spotNumber.trim();
        Garage garage = garageRepo.findById(garageId).orElseThrow(() -> new IllegalArgumentException("Garage with id " + garageId + " not found"));
        ParkingSpot.SpotType spotType = parseTypeorDefault(type, ParkingSpot.SpotType.LARGE);
        if (spotsRepo.existsByGarageIdAndSpotNumberIgnoreCase(garageId, number)) {
            throw new IllegalArgumentException("Spot with number " + number + " already exists in garage " + garage.getName());
        }
        ParkingSpot spot = ParkingSpot.builder()
                .garage(garage)
                .spotNumber(number)
                .type(spotType)
                .build();
        return spotsRepo.save(spot);
    }

    private ParkingSpot.SpotType parseTypeorDefault(String typeRaw, ParkingSpot.SpotType defaultType) {
        if (typeRaw == null || typeRaw.isBlank()) {
            return defaultType;
        }
        try {
            return ParkingSpot.SpotType.valueOf(typeRaw.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return defaultType;
        }
    }


}
