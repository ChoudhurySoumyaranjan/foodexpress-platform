package com.lucky.main.repository;

import com.lucky.main.entity.Food;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FoodRepository extends JpaRepository<Food, Long> {
    List<Food> findByCategoryIdAndActiveTrue(Long categoryId);

    @Query("""
                SELECT f
                FROM Food f
                WHERE f.active = true
                  AND (
                        LOWER(f.foodName) LIKE LOWER(CONCAT('%', :keyword, '%'))
                     OR LOWER(f.description) LIKE LOWER(CONCAT('%', :keyword, '%'))
                     OR LOWER(f.category.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                  )
            """)
    List<Food> searchFoods(@Param("keyword") String keyword);

    Page<Food> findByActiveTrue(Pageable pageable);

    List<Food> findByActiveFalse();
}
