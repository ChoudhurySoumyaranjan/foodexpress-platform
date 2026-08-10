package com.lucky.main.service;

import com.lucky.main.dto.FoodRequest;
import com.lucky.main.dto.FoodResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FoodService {
    FoodResponse addFood(FoodRequest foodRequest, MultipartFile file);
    List<FoodResponse> getAllFoods();
    FoodResponse updateFood(Long id,FoodRequest foodRequest, MultipartFile file);
    FoodResponse getFoodById(long id);
    FoodResponse deleteFoodById(long id);
    List<FoodResponse> getFoodsByCategory(Long categoryId);
    List<FoodResponse> filterFoodsByKeyword(String keyword);
    Long getTotalFoodsCount();
}
