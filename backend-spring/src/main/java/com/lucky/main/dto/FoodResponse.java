package com.lucky.main.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodResponse {
    private Long id;
    private String imageUrl;
    private String publicId;
    private String foodName;
    private String categoryName;
    private String description;
    private Double price;
    private Integer stock;
    private Double discount;
    private Double discountedPrice;
    private Boolean active;
}
