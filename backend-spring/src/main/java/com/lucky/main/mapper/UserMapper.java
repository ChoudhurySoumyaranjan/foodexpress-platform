package com.lucky.main.mapper;

import com.lucky.main.dto.UserResponse;
import com.lucky.main.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class UserMapper {
    public static UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getFirstName() + " " + user.getLastName())
                .email(user.getEmail())
                .roles(user.getRoles())
                .address(user.getAddress())
                .phoneNumber(user.getPhoneNumber())
                .createAt(user.getCreatedAt())
                .updateAt(user.getUpdatedAt())
                .isEnabled(user.isEnabled())
                .build();
    }
}
