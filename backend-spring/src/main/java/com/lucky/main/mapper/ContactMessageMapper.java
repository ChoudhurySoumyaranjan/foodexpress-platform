package com.lucky.main.mapper;

import com.lucky.main.dto.ContactMessageRequest;
import com.lucky.main.dto.ContactMessageResponse;
import com.lucky.main.entity.ContactMessage;

public class ContactMessageMapper {

    public static ContactMessageResponse toResponse(ContactMessage contactMessage) {

        return ContactMessageResponse.builder()
                .id(contactMessage.getId())
                .fullName(contactMessage.getFullName())
                .email(contactMessage.getEmail())
                .message(contactMessage.getMessage())
                .createdAt(contactMessage.getCreatedAt())
                .orderId(contactMessage.getOrderId())
                .phoneNumber(contactMessage.getPhoneNumber())
                .subject(contactMessage.getSubject())
                .status(contactMessage.getStatus())
                .build();
    }

    public static ContactMessage toEntity(ContactMessageRequest request) {

        return ContactMessage.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .message(request.getMessage())
                .phoneNumber(request.getPhoneNumber())
                .orderId(request.getOrderId())
                .subject(request.getSubject())
                .build();
    }
}