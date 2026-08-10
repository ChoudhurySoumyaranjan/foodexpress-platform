package com.lucky.main.dto;

import com.lucky.main.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class RecentOrderDTO {

    private Long orderId;

    private String customerName;

    private Double totalAmount;

    private OrderStatus status;

    private LocalDateTime orderDate;

}