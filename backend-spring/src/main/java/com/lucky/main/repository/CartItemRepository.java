package com.lucky.main.repository;

import com.lucky.main.dto.TopSellingFoodDTO;
import com.lucky.main.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.awt.print.Pageable;
import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    Optional<CartItem> findByCart_IdAndFood_Id(
            Long cartId,
            Long foodId
    );

}