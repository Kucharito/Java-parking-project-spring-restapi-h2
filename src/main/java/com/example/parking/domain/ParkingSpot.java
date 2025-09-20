package com.example.parking.domain;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@Table(name = "parking_spot",
       indexes = {@Index(name = "idx_spot_number", columnList = "garage_id")},
       uniqueConstraints = {@UniqueConstraint(name = "uc_garage_spot_number",columnNames = {"spotNumber", "garage_id"})})
public class ParkingSpot {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;
    @Column(name = "spotNumber", nullable = false, length = 32)
    private String spotNumber;
    @Enumerated(EnumType.STRING)
    @Column(length = 16, nullable = false)
    private SpotType type;
    @Column(nullable = false)
    private boolean isOccupied;

    public enum SpotType { COMPACT, LARGE, HANDICAPPED}

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "garage_id", nullable = false)
    private Garage garage;
}
