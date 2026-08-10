package com.lucky.main.dto;

import com.lucky.main.enums.TicketStatus;
import com.lucky.main.enums.TicketSubject;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class RecentQueryDTO {

    private Long id;

    private String fullName;

    private TicketStatus status;

    private TicketSubject subject;

    private LocalDateTime createdAt;
}