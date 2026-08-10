package com.lucky.main.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class CreatePaymentOrderResponse {

    private String orderId;

    private Integer amount;

    private String currency;

    private String key;

}