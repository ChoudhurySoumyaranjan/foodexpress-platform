package com.lucky.main.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TopSellingFoodDTO {

    private Long foodId;

    private String foodName;

    private Long totalSold;

}