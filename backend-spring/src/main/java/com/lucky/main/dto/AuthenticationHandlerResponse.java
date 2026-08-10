package com.lucky.main.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class AuthenticationHandlerResponse {
    private String accessToken;
    private String tokenType;
    private UserResponse user;
}
