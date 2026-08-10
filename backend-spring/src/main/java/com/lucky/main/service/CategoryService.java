package com.lucky.main.service;

import com.lucky.main.dto.CategoryRequest;
import com.lucky.main.dto.CategoryResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CategoryService {

    CategoryResponse create(CategoryRequest request, MultipartFile multipartFile);

    List<CategoryResponse> getAll();

    CategoryResponse getById(Long id);

    void delete(Long id);

    CategoryResponse update(Long id, CategoryRequest request, MultipartFile multipartFile);
    Long totalCategoriesCount();
}
