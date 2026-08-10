package com.lucky.main.dto;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CartResponse {

    private Long foodId;
    private String foodName;
    private String imageUrl;
    private Integer stock;
    private Double originalPrice;
    private Double discountedPrice;

    private Integer quantity;

    private Double totalPrice;
}