package com.lucky.main.service;

import com.lucky.main.dto.payment.CreatePaymentOrderResponse;

public interface PaymentService {

    CreatePaymentOrderResponse createOrder(Double amount) throws Exception;

}