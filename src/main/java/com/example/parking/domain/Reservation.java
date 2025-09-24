package com.example.parking.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;



@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "reservation",
        indexes = {@Index(name = "idx_reservation_spot_id", columnList = "parking_spot_id"),
                @Index(name = "idx_res_interval", columnList = "start_time, end_time")})

public class Reservation {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "parking_spot_id", nullable = false)
    private ParkingSpot parkingSpot;

    @Column(name = "license_plate", nullable = false, length = 16)
    private String licensePlate;

    @Column(name = "start_time", nullable = false)
    private OffsetDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private OffsetDateTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(length = 16, nullable = false)
    private ReservationStatus status;
}