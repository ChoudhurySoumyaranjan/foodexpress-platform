package com.lucky.main.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lucky.main.dto.FoodRequest;
import com.lucky.main.dto.FoodResponse;
import com.lucky.main.exception.food.FoodException;
import com.lucky.main.service.FoodService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/admin/api/foods")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Slf4j
public class AdminFoodController {

    private final FoodService foodService;
    private final ObjectMapper objectMapper;

    @PostMapping
    public ResponseEntity<FoodResponse> addFood(
            @RequestPart("image") MultipartFile image,
            @RequestPart("food") String foodString
    ) {
        try {
            FoodRequest foodRequest =
                    objectMapper.readValue(foodString, FoodRequest.class);

            FoodResponse response = foodService.addFood(foodRequest, image);

            URI location = ServletUriComponentsBuilder
                    .fromCurrentRequest()
                    .path("/{id}")
                    .buildAndExpand(response.getId())
                    .toUri();

            return ResponseEntity.created(location).body(response);

        } catch (JsonProcessingException e) {
            throw new FoodException(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<FoodResponse> getFoodById(@PathVariable long id) {
        return ResponseEntity.ok(foodService.getFoodById(id));
    }


    @PutMapping("/{id}")
    public ResponseEntity<FoodResponse> updateFood(
            @RequestPart(value = "image", required = false) MultipartFile file,
            @RequestPart("food") String foodJson,
            @PathVariable Long id
    ) throws Exception {

        ObjectMapper mapper = new ObjectMapper();
        FoodRequest request = mapper.readValue(foodJson, FoodRequest.class);

        return ResponseEntity.ok(foodService.updateFood(id, request, file));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<FoodResponse> deleteFoodById(@PathVariable long id) {
        return ResponseEntity.ok(foodService.deleteFoodById(id));
    }
    @GetMapping("/count")
    public ResponseEntity<Long> getFoodsCount() {
        return ResponseEntity.ok(foodService.getTotalFoodsCount());
    }


    @GetMapping
    public ResponseEntity<Page<FoodResponse>> getPaginatedFood(@PageableDefault(size = 7, sort = "id") Pageable pageable) {
        Page<FoodResponse> foodResponses = foodService.getPaginatedFoods(pageable);

        if (foodResponses.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(foodResponses);
    }
}