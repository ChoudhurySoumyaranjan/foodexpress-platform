package com.lucky.main.service.impl;

import com.lucky.main.cloudinary.CloudinaryService;
import com.lucky.main.dto.FoodRequest;
import com.lucky.main.dto.FoodResponse;
import com.lucky.main.dto.PageResponse;
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
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    @Caching(
            evict = {
                    @CacheEvict(value = "foods", allEntries = true),
                    @CacheEvict(value = "searchFoods", allEntries = true),
                    @CacheEvict(value = "foodsByCategory", allEntries = true),
                    @CacheEvict( value = "foodsPage", allEntries = true),
                    @CacheEvict( value = "foodList", allEntries = true)
            }
    )
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
    @Cacheable(
            value = "foodsPage",
            key = "#pageable.pageNumber + '-' + #pageable.pageSize"
    )
    public PageResponse<FoodResponse> getPaginatedFoods(Pageable pageable) {

        try {
            Page<FoodResponse> page= foodRepository.findByActiveTrue(pageable) //Page<Food>
                    .map(food -> FoodMapper.toResponse(food)); //Page<FoodResponse>
            return new PageResponse<>(
                    page.getContent(),
                    page.getNumber(),
                    page.getSize(),
                    page.getTotalElements(),
                    page.getTotalPages(),
                    page.isFirst(),
                    page.isLast()  //PageResponse<FoodResponse>
                    );
        } catch (Exception e) {
            throw new FoodNotFoundException(e.getMessage());
        }
    }

    @Override
    @Cacheable(value = "foodList", key = "'all'")
    public List<FoodResponse> getAllFoods() {

       // System.out.println("getAllFoods method executed Database Called");

        return foodRepository.findByActiveTrue()
                .stream()
                .map(food -> FoodMapper.toResponse(food))
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "foods", key = "#id")
    public FoodResponse getFoodById(long id) {
        com.lucky.main.entity.Food food = foodRepository.findByIdAndActiveTrue(id).orElseThrow(() -> new FoodNotFoundException(id));
        return FoodMapper.toResponse(food);
    }

    @Override
    @Caching(
            evict = {
                    @CacheEvict(value = "foods", key = "#id"),
                    @CacheEvict(value = "searchFoods", allEntries = true),
                    @CacheEvict(value = "foodsByCategory", allEntries = true),
                    @CacheEvict( value = "foodsPage", allEntries = true),
                    @CacheEvict( value = "foodList", allEntries = true)
            }
    )
    public FoodResponse deleteFoodById(long id) {
        Food food = foodRepository.findById(id)
                .orElseThrow(() -> new FoodNotFoundException(id));

        //foodRepository.delete(food);
        food.setActive(false);
        Food updated = foodRepository.save(food);
        return FoodMapper.toResponse(updated);
    }

    @Override
    @Cacheable(value = "foodsByCategory", key = "#categoryId")
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
    @Cacheable(
            value = "searchFoods",
            key = "#keyword == null || #keyword.trim() == '' ? 'all' : #keyword.trim().toLowerCase()"
    )
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
    @Caching(
            evict = {
                    @CacheEvict(value = "searchFoods", allEntries = true),
                    @CacheEvict(value = "foodsByCategory", allEntries = true),
                    @CacheEvict( value = "foodsPage", allEntries = true),
                    @CacheEvict( value = "foodList", allEntries = true)
            },
            put = {
                    @CachePut(value = "foods", key = "#foodId")
            }
    )
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

}