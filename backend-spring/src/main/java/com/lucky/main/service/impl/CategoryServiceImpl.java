package com.lucky.main.service.impl;

import com.lucky.main.cloudinary.CloudinaryService;
import com.lucky.main.dto.CategoryRequest;
import com.lucky.main.dto.CategoryResponse;
import com.lucky.main.dto.PageResponse;
import com.lucky.main.entity.Category;
import com.lucky.main.exception.CloudinaryImageException;
import com.lucky.main.exception.category.CategoryImageException;
import com.lucky.main.exception.category.CategoryNotFoundException;
import com.lucky.main.mapper.CategoryMapper;
import com.lucky.main.repository.CategoryRepository;
import com.lucky.main.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
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
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CloudinaryService cloudinaryService;

    private final String DEFAULT_IMAGE =
            "https://res.cloudinary.com/dlcckvlfx/image/upload/v1775580029/default_product.jpg";

    @Override
    @Caching(
            evict = {
                    @CacheEvict(value = "category",allEntries = true),
                    @CacheEvict(value = "categoryPage", allEntries = true)
            }
    )
    public CategoryResponse create(CategoryRequest request, MultipartFile file) {

        try {
            Category category = CategoryMapper.toEntity(request);
            category.setActive(true);
            if (file != null && !file.isEmpty()) {
                //imageUrl = cloudinaryService.uploadImage(file);

                Map<String,String> uploadedResult = cloudinaryService.uploadImage(file);
                category.setImage(uploadedResult.get("url"));
                category.setPublicId(uploadedResult.get("publicId"));

            }else {
                category.setImage(DEFAULT_IMAGE);
                category.setPublicId(null);
            }


            Category savedCategory = categoryRepository.save(category);

            return CategoryMapper.toResponse(savedCategory);

        } catch (IOException e) {
            throw new CategoryImageException("Image upload failed");
        } catch (Exception e) {
            throw new RuntimeException("Failed to create category", e);
        }
    }

    @Override
    @Cacheable(
            value = "categoryPage",
            key = "#pageable.pageNumber + '-' + #pageable.pageSize"
    )
    public PageResponse<CategoryResponse> getAll(Pageable pageable) {
        Page<CategoryResponse> page = categoryRepository.findByActiveTrue(pageable)  //Page<Category>
                .map((category)->CategoryMapper.toResponse(category));  //Page<CategoryResponse>

        return new PageResponse<>(  //PageResponse<CategoryResponse>
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast()
                );
                // returning Page<CategoryResponse> works perfectly.
                // However, when we directly cache Page<CategoryResponse>
                // in Redis, Spring Data usually uses the PageImpl implementation internally.
                // GenericJackson2JsonRedisSerializer can serialize this object, but when reading it back from Redis,
                // Jackson may not know how to reconstruct the PageImpl object.
    }

    @Override
    @Cacheable(value = "category", key = "'all'")
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAllByActiveTrue()
                .stream()
                .map((category -> CategoryMapper.toResponse(category)))
                .collect(Collectors.toList());
    }


    @Override
    @Cacheable(value = "category", key = "#id")
    public CategoryResponse getById(Long id) {
        Category category = categoryRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() ->
                        new CategoryNotFoundException("Category not found with id: " + id));

        return CategoryMapper.toResponse(category);
    }

    @Override
    @Caching(
            evict = {
                    @CacheEvict(value = "category",key = "'all'"),
                    @CacheEvict(value = "category",key = "#id"),
                    @CacheEvict(value = "categoryPage", allEntries = true)
            }
    )
    public void delete(Long id) {

        Category category = categoryRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() ->
                        new CategoryNotFoundException("Category not found with id: " + id));

        if (category.getPublicId() != null) {
            try {
                cloudinaryService.deleteImage(category.getPublicId());
            } catch (Exception e) {
                System.out.println("Failed to delete image: " + e.getMessage());
            }
        }

        category.setActive(false);
        categoryRepository.save(category);
    }

    @Override
    @Caching(
            evict = {
                    @CacheEvict(value = "category",key = "'all'"),
                    @CacheEvict(value = "category", key = "#id"),
                    @CacheEvict(value = "categoryPage", allEntries = true)
            }
    )
    public CategoryResponse update(Long id, CategoryRequest request, MultipartFile multipartFile) {

        Category category = categoryRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() ->
                        new CategoryNotFoundException("Category not found with id: " + id));
        category.setName(request.getName());

        try {
            if (multipartFile != null && !multipartFile.isEmpty()) {

                //  delete old image if exists
                if (category.getPublicId() != null) {
                    try {
                        cloudinaryService.deleteImage(category.getPublicId());
                    } catch (Exception e) {
                        System.out.println("Failed to delete old image: " + e.getMessage());
                    }
                }

                // upload new image
                Map<String, String> uploadedDetails = cloudinaryService.uploadImage(multipartFile);

                category.setImage(uploadedDetails.get("url"));
                category.setPublicId(uploadedDetails.get("publicId"));
            }

            // Save and return
            Category updated = categoryRepository.save(category);
            return CategoryMapper.toResponse(updated);

        } catch (Exception e) {
            throw new CloudinaryImageException("Image update failed: " + e.getMessage());
        }
    }

    @Override
    public Long totalCategoriesCount() {
        return categoryRepository.countByActiveTrue();
    }
}
