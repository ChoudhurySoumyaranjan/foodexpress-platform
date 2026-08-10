package com.lucky.main.service;

import com.lucky.main.dto.payment.VerifyPaymentRequest;
import com.lucky.main.dto.payment.VerifyPaymentResponse;

public interface PaymentVerificationService {

    VerifyPaymentResponse verifyPayment(
            VerifyPaymentRequest request
    ) throws Exception;

}