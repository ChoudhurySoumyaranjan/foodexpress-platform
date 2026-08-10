package com.lucky.main.service.impl;

import com.lucky.main.cloudinary.CloudinaryService;
import com.lucky.main.dto.FoodRequest;
import com.lucky.main.dto.FoodResponse;
import com.lucky.main.entity.Category;
import com.lucky.main.entity.Food;
import com.lucky.main.exception.category.CategoryNotFoundException;
import com.lucky.main.exception.food.FoodImageException;
import com.lucky.main.exception.food.FoodNotFoundException;
import com.lucky.main.mapper.FoodMapper;
import com.lucky.main.repository.CategoryRepository;
import com.lucky.main.repository.FoodRepository;
import com.lucky.main.service.FoodService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FoodServiceImpl implements FoodService {

    private final CloudinaryService cloudinaryService;
    private final FoodRepository foodRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public FoodResponse addFood(FoodRequest request, MultipartFile file) {

        String DEFAULT_IMAGE =
                "https://res.cloudinary.com/dlcckvlfx/image/upload/v1775580029/default_product.jpg";

        try {

            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new CategoryNotFoundException("Category not found"));

            Food food = FoodMapper.toEntity(request, category);

            if (file != null && !file.isEmpty()) {
                Map<String, String> uploadResult = cloudinaryService.uploadImage(file);
                food.setImageUrl(uploadResult.get("url"));
                food.setPublicId(uploadResult.get("publicId"));
            } else {
                food.setImageUrl(DEFAULT_IMAGE);
                food.setPublicId(null);
            }

            Food savedFood = foodRepository.save(food);

            return FoodMapper.toResponse(savedFood);

        } catch (IOException e) {
            throw new FoodImageException("Image upload failed");
        }
    }

    @Override
    public List<FoodResponse> getAllFoods() {

        try {
            return foodRepository.findByActiveTrue()
                    .stream()
                    .map(food -> FoodMapper.toResponse(food)).collect(Collectors.toList());
        } catch (Exception e) {
            throw new FoodNotFoundException(e.getMessage());
        }
    }

    @Override
    public FoodResponse getFoodById(long id) {
        com.lucky.main.entity.Food food = foodRepository.findById(id).orElseThrow(() -> new FoodNotFoundException(id));
        return FoodMapper.toResponse(food);
    }

    @Override
    public FoodResponse deleteFoodById(long id) {
        Food food = foodRepository.findById(id)
                .orElseThrow(() -> new FoodNotFoundException(id));

        // delete image from cloudinary (if exists)
        if (food.getPublicId() != null) {
            try {
                cloudinaryService.deleteImage(food.getPublicId());
            } catch (Exception e) {
                System.out.println("Failed to delete image: " + e.getMessage());
            }
        }

        //foodRepository.delete(food);
        food.setActive(false);
        Food updated =foodRepository.save(food);
        return FoodMapper.toResponse(updated);
    }

    @Override
    public List<FoodResponse> getFoodsByCategory(Long categoryId) {

        try {
            return foodRepository.findByCategoryIdAndActiveTrue(categoryId)
                    .stream()
                    .map(food -> FoodMapper.toResponse(food))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new FoodNotFoundException(e.getMessage());
        }
    }

    @Override
    public List<FoodResponse> filterFoodsByKeyword(String keyword) {
        try {
            return foodRepository.searchFoods(keyword)
                    .stream()
                    .map(FoodMapper::toResponse).toList();

        } catch (Exception e) {
            throw new FoodNotFoundException(e.getMessage());
        }
    }

    @Override
    public Long getTotalFoodsCount() {
        return foodRepository.count();
    }

    @Override
    public FoodResponse updateFood(Long foodId, FoodRequest request, MultipartFile file) {

        Food food = foodRepository.findById(foodId)
                .orElseThrow(() -> new FoodNotFoundException(foodId));

        food.setFoodName(request.getFoodName());
        food.setDescription(request.getDescription());
        food.setPrice(request.getPrice());
        food.setStock(request.getStock());
        food.setDiscount(request.getDiscount());

        // Update category if changed
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new CategoryNotFoundException("Category not found"));
            food.setCategory(category);
        }

        // Calculate discounted price
        if (request.getPrice() != null) {
            Double discount = request.getDiscount() != null ? request.getDiscount() : 0.0;
            Double discountedPrice = request.getPrice() - (request.getPrice() * discount / 100);
            food.setDiscountedPrice(discountedPrice);
        }

        try {
            // If new image is provided
            if (file != null && !file.isEmpty()) {

                //delete old image if exists
                if (food.getPublicId() != null) {
                    try {
                        cloudinaryService.deleteImage(food.getPublicId());
                    } catch (Exception e) {
                        System.out.println("Failed to delete old image: " + e.getMessage());
                    }
                }

                // upload new image
                Map<String, String> uploadResult = cloudinaryService.uploadImage(file);

                food.setImageUrl(uploadResult.get("url"));
                food.setPublicId(uploadResult.get("publicId"));
            }

            // Save and return
            Food updatedFood = foodRepository.save(food);
            return FoodMapper.toResponse(updatedFood);

        } catch (Exception e) {
            throw new FoodImageException("Food image update failed: " + e.getMessage());
        }
    }


    // Clean reusable method
//    private Double calculateDiscountedPrice(Double price, Double discount) {
//        if (price == null) return 0.0;
//
//        if (discount == null || discount <= 0) {
//            return price;
//        }
//
//        return price - (price * discount / 100);
//    }
}
