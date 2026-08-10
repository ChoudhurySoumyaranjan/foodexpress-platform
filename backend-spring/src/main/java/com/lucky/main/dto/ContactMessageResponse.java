package com.lucky.main.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.lucky.main.enums.TicketStatus;
import com.lucky.main.enums.TicketSubject;
import lombok.*;

import java.time.LocalDateTime;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContactMessageResponse {

    private Long id;

    private String message;

    private String fullName;

    private String email;

    private String phoneNumber;

    private String orderId;

    private TicketSubject subject;

    private TicketStatus status;

    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
    private LocalDateTime createdAt;
}