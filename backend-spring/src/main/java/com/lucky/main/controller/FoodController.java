package com.lucky.main.controller;


import com.lucky.main.dto.FoodResponse;
import com.lucky.main.service.FoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/foods")
public class FoodController {

    @Autowired
    private FoodService foodService;

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<FoodResponse>> getAllFoodByCategory(
            @PathVariable Long categoryId
    ) {
        List<FoodResponse> foods = foodService.getFoodsByCategory(categoryId);
        if (foods.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(foods);
    }

    @GetMapping
    public ResponseEntity<Page<FoodResponse>> getAllFood(@PageableDefault(size = 7, sort = "id") Pageable pageable) {
        Page<FoodResponse> foodResponses = foodService.getAllFoods(pageable);

        if (foodResponses.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(foodResponses);
    }

    @GetMapping("/search")
    public ResponseEntity<List<FoodResponse>> getFoodsBySearch(@RequestParam String keyword) {
        java.util.List<FoodResponse> response = foodService.filterFoodsByKeyword(keyword);
        if (response.isEmpty()) {
            ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(response);
    }
}
