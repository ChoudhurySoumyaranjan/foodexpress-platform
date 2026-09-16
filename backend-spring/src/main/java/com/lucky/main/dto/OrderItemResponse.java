package com.lucky.main.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemResponse {

    private Long foodId;

    private String foodName;

    private String imageUrl;

    private Integer quantity;

    private Double price;

    private Double totalPrice;
}