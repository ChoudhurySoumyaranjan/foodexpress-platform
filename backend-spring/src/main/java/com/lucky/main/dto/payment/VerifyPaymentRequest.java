package com.lucky.main.dto.payment;

import com.lucky.main.dto.PlaceOrderRequest;
import lombok.Data;

@Data
public class VerifyPaymentRequest {

    private String razorpayOrderId;

    private String razorpayPaymentId;

    private String razorpaySignature;

    private PlaceOrderRequest orderRequest;

}