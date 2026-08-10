package com.lucky.main.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderItemResponse {

    private Long foodId;

    private String foodName;

    private String imageUrl;

    private Integer quantity;

    private Double price;

    private Double totalPrice;
}