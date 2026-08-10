package com.lucky.main.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ForgotPasswordRequest {

    @Email(message = "Invalid Email")
    @NotBlank(message = "Email is required")
    private String email;

}
