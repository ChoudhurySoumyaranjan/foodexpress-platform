package com.lucky.main.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TopSellingFoodDTO {

    private Long foodId;

    private String foodName;

    private Long totalSold;

}