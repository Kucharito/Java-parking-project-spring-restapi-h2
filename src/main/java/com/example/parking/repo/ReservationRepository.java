package com.example.parking.repo;

import com.example.parking.domain.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.OffsetDateTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository <Reservation, Long> {
    @Query("SELECT r FROM Reservation r WHERE r.parkingSpot.id = :spotId AND r.status <> com.example.parking.domain.ReservationStatus.CANCELED AND r.startTime < :endTime AND r.endTime > :startTime")
    List<Reservation> findOverlapping(Long spotId, OffsetDateTime startTime, OffsetDateTime endTime);
}
