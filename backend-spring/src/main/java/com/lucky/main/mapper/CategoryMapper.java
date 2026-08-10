package com.lucky.main.mapper;

import com.lucky.main.dto.CategoryRequest;
import com.lucky.main.dto.CategoryResponse;
import com.lucky.main.entity.Category;

public class CategoryMapper {

    public static Category toEntity(CategoryRequest request) {
        return Category.builder()
                .name(request.getName())
                //.image(request.getImage())
                .build();
    }

    public static CategoryResponse toResponse(Category category) {

        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .image(category.getImage())
                .publicId(category.getPublicId())
                .build();
    }
}
