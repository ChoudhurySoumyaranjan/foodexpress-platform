package com.lucky.main.repository;

import com.lucky.main.dto.TopSellingFoodDTO;
import com.lucky.main.entity.OrderItem;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    @Query("""
            SELECT new com.lucky.main.dto.TopSellingFoodDTO(
                oi.food.id,
                oi.food.foodName,
                SUM(oi.quantity)
            )
            FROM OrderItem oi
            GROUP BY oi.food.id, oi.food.foodName
            ORDER BY SUM(oi.quantity) DESC
            """)
    List<TopSellingFoodDTO> findTopSellingFoods(Pageable pageable);
}
