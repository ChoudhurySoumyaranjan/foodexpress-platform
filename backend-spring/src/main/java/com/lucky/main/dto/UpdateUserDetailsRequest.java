package com.lucky.main.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateUserDetailsRequest {
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String address;
}
