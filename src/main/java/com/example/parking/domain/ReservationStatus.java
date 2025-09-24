package com.example.parking.domain;


import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

public enum ReservationStatus {
    CREATED, CHECKED_IN, CHECKED_OUT, CANCELED
}

