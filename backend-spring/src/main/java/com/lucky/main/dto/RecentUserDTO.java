package com.lucky.main.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class RecentUserDTO {

    private Long id;

    private String fullName;

    private String email;

    private LocalDateTime createdAt;

}