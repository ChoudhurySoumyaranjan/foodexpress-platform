package com.lucky.main.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lucky.main.dto.CategoryRequest;
import com.lucky.main.dto.CategoryResponse;
import com.lucky.main.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/admin/api/categories")
@RequiredArgsConstructor
public class AdminCategoryController {

    private final CategoryService categoryService;

    private final ObjectMapper objectMapper;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryResponse> create(@RequestPart("category") String category,
                                                   @RequestPart("image")MultipartFile multipartFile) throws JsonProcessingException {

        com.lucky.main.dto.CategoryRequest categoryRequest =objectMapper.readValue(category, CategoryRequest.class);
        return ResponseEntity.ok(categoryService.create(categoryRequest,multipartFile));
    }
    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAll() {
        return ResponseEntity.ok(categoryService.getAll());
    }

    @GetMapping("/{id}")
    //@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getById(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryResponse> updateCategory(@RequestPart(value = "image",required = false)MultipartFile multipartFile,
                                                           @RequestPart("category") String request,
                                                           @PathVariable Long id
                                                           ) throws JsonProcessingException {
        com.lucky.main.dto.CategoryRequest categoryRequest =objectMapper.readValue(request,CategoryRequest.class);
        return ResponseEntity.ok(categoryService.update(id, categoryRequest, multipartFile));
    }

    @GetMapping("/count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> getCategoriesCount(){
        return ResponseEntity.ok(categoryService.totalCategoriesCount());
    }
}
