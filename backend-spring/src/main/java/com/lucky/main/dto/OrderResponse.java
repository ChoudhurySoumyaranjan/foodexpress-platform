package com.lucky.main.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.lucky.main.enums.OrderStatus;
import com.lucky.main.enums.PaymentStatus;
import com.lucky.main.enums.PaymentType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderResponse {

    private Long orderId;

    private Double totalAmount;

    private OrderStatus status;

    private String customerName;

    private String phoneNumber;

    private PaymentType paymentMethod;

    private String deliveryAddress;

    private String razorpayOrderId;

    private String razorpayPaymentId;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    @JsonFormat(pattern = "dd MMM yyyy hh:mm a")
    private LocalDateTime orderDate;

    private List<OrderItemResponse> items;
}