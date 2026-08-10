package com.lucky.main.dto;

import com.lucky.main.enums.PaymentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PlaceOrderRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Customer name is required")
    private String customerName;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    @NotNull(message = "Payment method is required")
    private PaymentType paymentMethod;

    private String razorpayOrderId;

    private String razorpayPaymentId;

    private String razorpaySignature;

    @NotBlank(message = "Delivery address is required")
    private String deliveryAddress;
}