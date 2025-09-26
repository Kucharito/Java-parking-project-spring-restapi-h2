package com.example.parking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.OffsetDateTime;

public class ReservationDtos {
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateRequest {
        @NotNull
        private Long spotId;
        @NotBlank @Size(max = 16)
        private String licensePlate;
        @NotNull
        private OffsetDateTime startTime;
        @NotNull
        private OffsetDateTime endTime;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response{
        private Long id;
        private Long spotId;
        private String spotNumber;
        private String licensePlate;
        private OffsetDateTime startTime;
        private OffsetDateTime endTime;
        private String status;
    }
}
