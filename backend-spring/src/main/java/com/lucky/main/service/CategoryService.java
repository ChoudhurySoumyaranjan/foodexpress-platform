package com.lucky.main.service;

import com.lucky.main.dto.CategoryRequest;
import com.lucky.main.dto.CategoryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CategoryService {

    CategoryResponse create(CategoryRequest request, MultipartFile multipartFile);

    Page<CategoryResponse> getAll(Pageable pageable);

    List<CategoryResponse> getAllCategories();

    CategoryResponse getById(Long id);

    void delete(Long id);

    CategoryResponse update(Long id, CategoryRequest request, MultipartFile multipartFile);
    Long totalCategoriesCount();
}
