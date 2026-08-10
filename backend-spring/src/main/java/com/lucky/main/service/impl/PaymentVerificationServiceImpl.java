package com.lucky.main.service.impl;

import com.lucky.main.dto.PlaceOrderRequest;
import com.lucky.main.dto.payment.VerifyPaymentRequest;
import com.lucky.main.dto.payment.VerifyPaymentResponse;
import com.lucky.main.service.OrderService;
import com.lucky.main.service.PaymentVerificationService;
import com.razorpay.Utils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.json.JSONObject;

@Service
@RequiredArgsConstructor
public class PaymentVerificationServiceImpl
        implements PaymentVerificationService {

    @Value("${razorpay.key.secret}")
    private String razorpaySecret;

    private final OrderService orderService;

    @Override
    public VerifyPaymentResponse verifyPayment(
            VerifyPaymentRequest request
    ) throws Exception {

        JSONObject options = new JSONObject();

        options.put("razorpay_order_id", request.getRazorpayOrderId());
        options.put("razorpay_payment_id", request.getRazorpayPaymentId());
        options.put("razorpay_signature", request.getRazorpaySignature());

        boolean valid = Utils.verifyPaymentSignature(options, razorpaySecret);

        if (!valid) {

            return VerifyPaymentResponse.builder()
                    .success(false)
                    .message("Invalid Payment Signature")
                    .orderId(null)
                    .build();

        }

        PlaceOrderRequest orderRequest = request.getOrderRequest();

        orderRequest.setRazorpayOrderId(request.getRazorpayOrderId());
        orderRequest.setRazorpayPaymentId(request.getRazorpayPaymentId());
        orderRequest.setRazorpaySignature(request.getRazorpaySignature());

        Long orderId = orderService.placeOrder(orderRequest);

        return VerifyPaymentResponse.builder()
                .success(true)
                .message("Payment Verified Successfully")
                .orderId(orderId)
                .build();

    }
}