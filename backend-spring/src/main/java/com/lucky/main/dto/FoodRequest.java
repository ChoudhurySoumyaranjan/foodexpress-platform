package com.lucky.main.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FoodRequest {
    private String foodName;
    private Long categoryId;
    private String description;
    private Double price;
    private Integer stock;
    private Double discount;
    //private Boolean active;
}
