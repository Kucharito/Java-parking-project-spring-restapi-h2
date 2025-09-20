package com.example.parking.repo;

import com.example.parking.domain.ParkingSpot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParkingSpotRepository extends JpaRepository<ParkingSpot, Long> {
    List<ParkingSpot> findByGarageId(Long garageId);
    boolean existsByGarageIdAndSpotNumberIgnoreCase(Long garageId, String spotNumber);
}
