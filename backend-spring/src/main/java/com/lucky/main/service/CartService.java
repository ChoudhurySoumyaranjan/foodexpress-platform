package com.lucky.main.service;

import com.lucky.main.dto.CartRequest;
import com.lucky.main.dto.CartResponse;

import java.util.List;

public interface CartService {

    void addToCart(CartRequest request);

    List<CartResponse> getCart(Long userId);

    void increaseQuantity(Long userId, Long foodId);

    void decreaseQuantity(Long userId, Long foodId);

    void removeItem(Long userId, Long foodId);

    void clearCart(Long userId);
}