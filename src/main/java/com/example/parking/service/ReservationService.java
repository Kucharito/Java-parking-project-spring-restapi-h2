package com.example.parking.service;

import com.example.parking.domain.ParkingSpot;
import com.example.parking.domain.Reservation;
import com.example.parking.domain.ReservationStatus;
import com.example.parking.repo.ReservationRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class ReservationService {
    private final ReservationRepository reservationRepo;
    private final ParkingSpotService spotsRepo;

    @Transactional
    public Reservation create(Long spotId, String licensePlate, OffsetDateTime startTime, OffsetDateTime endTime){
        if(spotId == null){
            throw new IllegalArgumentException("Spot ID cannot be null");
        }
        if (licensePlate == null || licensePlate.isBlank()) {
            throw new IllegalArgumentException("License plate cannot be blank");
        }
        if (startTime == null || endTime == null || !endTime.isAfter(startTime)) {
            throw new IllegalArgumentException("Invalid reservation time range");
        }

        ParkingSpot spot = spotsRepo.findById(spotId);

        if(!reservationRepo.findOverlapping(spotId, startTime, endTime).isEmpty()){
            throw new IllegalArgumentException("Parking spot with id " + spotId + " is already reserved for the given time range");
        }

        String plate  = licensePlate.trim().toUpperCase(Locale.ROOT);

        Reservation r = Reservation.builder()
                .parkingSpot(spot)
                .licensePlate(plate)
                .startTime(startTime)
                .endTime(endTime)
                .status(ReservationStatus.CREATED)
                .build();

        return reservationRepo.save(r);
    }
    @Transactional(readOnly = true)
    public Reservation get(Long id){
        return reservationRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reservation with id " + id + " not found"));
    }

    @Transactional
    public void cancel(Long id){
        Reservation r = get(id);
        if(r.getStatus() == ReservationStatus.CHECKED_OUT){
            throw new IllegalArgumentException("Reservation with id " + id + " is already canceled");
        } else {
            r.setStatus(ReservationStatus.CANCELED);
            reservationRepo.save(r);
        }
    }

    @Transactional
    public Reservation checkIn(Long id, OffsetDateTime now){
        Reservation r = get(id);
        if(r.getStatus() != ReservationStatus.CREATED){
            throw new IllegalArgumentException("Reservation with id " + id + " cannot be checked in");
        }
        OffsetDateTime start = (now == null) ? OffsetDateTime.now() : now;
        if(start.isBefore(r.getStartTime())|| start.isAfter(r.getEndTime())){
            throw new IllegalArgumentException("Reservation with id " + id + " cannot be checked in at this time");
        }
        r.setStatus(ReservationStatus.CHECKED_IN);
        return r;
    }

    @Transactional
    public Reservation checkOut(Long id, OffsetDateTime now){
        Reservation r = get(id);
        if(r.getStatus()!= ReservationStatus.CHECKED_OUT){
            throw new IllegalArgumentException("Reservation with id " + id + " cannot be checked out");
        }
        r.setStatus(ReservationStatus.CHECKED_OUT);
        return r;
    }

}
