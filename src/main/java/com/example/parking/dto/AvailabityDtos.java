package com.example.parking.dto;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AvailabityDtos {
    private Long id;
    private String number;
    private String type;
}
