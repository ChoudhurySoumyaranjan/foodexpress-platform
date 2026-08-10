package com.lucky.main.mapper;

import com.lucky.main.dto.FoodRequest;
import com.lucky.main.dto.FoodResponse;
import com.lucky.main.entity.Category;
import com.lucky.main.entity.Food;

public class FoodMapper {

    // Request → Entity
    public static Food toEntity(FoodRequest request, Category category) {

        double price = request.getPrice();
        double discount = request.getDiscount() != null ? request.getDiscount() : 0;

        double discountedPrice = price - (price * discount / 100);

        return Food.builder()
                .foodName(request.getFoodName())
                .category(category)   // IMPORTANT CHANGE
                .description(request.getDescription())
                .price(price)
                .active(true)
                .stock(request.getStock())
                .discount(discount)
                .discountedPrice(discountedPrice)
                .build();
    }

    // Entity → Response
    public static FoodResponse toResponse(Food food) {

        return FoodResponse.builder()
                .id(food.getId())
                .imageUrl(food.getImageUrl())
                .publicId(food.getPublicId())
                .foodName(food.getFoodName())
                .categoryName(food.getCategory().getName()) //  IMPORTANT CHANGE
                .description(food.getDescription())
                .price(food.getPrice())
                .stock(food.getStock())
                .active(food.getActive())
                .discount(food.getDiscount())
                .discountedPrice(food.getDiscountedPrice())
                .build();
    }
}