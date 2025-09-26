package com.example.parking.repo;

import com.example.parking.domain.ParkingSpot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParkingSpotRepository extends JpaRepository<ParkingSpot, Long> {
    List<ParkingSpot> findByGarageId(Long garageId);
    boolean existsByGarageIdAndSpotNumberIgnoreCase(Long garageId, String spotNumber);

    @Query("""
            select s from ParkingSpot s
            where s.garage.id = :garageId
            and not exists (
            select 1 from Reservation r 
            where r.parkingSpot = s
            and r.status <> com.example.parking.domain.ReservationStatus.CANCELED
            and (r.startTime < :endTime and r.endTime > :startTime)
            )
            """)
    List<ParkingSpot> findAvailableByGarageAndInterval(Long garageId, java.time.OffsetDateTime startTime, java.time.OffsetDateTime endTime);
}
