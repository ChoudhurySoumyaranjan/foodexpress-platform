package com.lucky.main.service.impl;

import com.lucky.main.config.RazorpayConfig;
import com.lucky.main.dto.payment.CreatePaymentOrderResponse;
import com.lucky.main.service.PaymentService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final RazorpayClient razorpayClient;
    private final RazorpayConfig razorpayConfig;

    @Value("${razorpay.currency}")
    private String currency;

    @Override
    public CreatePaymentOrderResponse createOrder(Double amount) throws Exception {

        JSONObject options = new JSONObject();

        // Razorpay accepts amount in paise
        options.put("amount", (int) (amount * 100));

        options.put("currency", currency);

        options.put("receipt", "receipt_" + System.currentTimeMillis());

        options.put("payment_capture", 1);

        Order order = razorpayClient.orders.create(options);

        return CreatePaymentOrderResponse.builder()
                .orderId(order.get("id"))
                .amount(order.get("amount"))
                .currency(order.get("currency"))
                .key(razorpayConfig.getKeyId())
                .build();
    }
}