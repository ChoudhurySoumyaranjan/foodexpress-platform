package com.lucky.main.controller;

import com.lucky.main.dto.payment.CreatePaymentOrderRequest;
import com.lucky.main.dto.payment.CreatePaymentOrderResponse;
import com.lucky.main.dto.payment.VerifyPaymentRequest;
import com.lucky.main.dto.payment.VerifyPaymentResponse;
import com.lucky.main.service.PaymentService;
import com.lucky.main.service.PaymentVerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final PaymentVerificationService paymentVerificationService;

    @PostMapping("/create-order")
    public ResponseEntity<CreatePaymentOrderResponse> createOrder(
            @RequestBody CreatePaymentOrderRequest request
    ) throws Exception {

        return ResponseEntity.ok(
                paymentService.createOrder(request.getAmount())
        );

    }
    @PostMapping("/verify")
    public ResponseEntity<VerifyPaymentResponse> verifyPayment(
            @RequestBody VerifyPaymentRequest request
    ) throws Exception {

        return ResponseEntity.ok(
                paymentVerificationService.verifyPayment(request)
        );

    }
}
