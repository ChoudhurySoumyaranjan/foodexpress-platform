package com.lucky.main.service.impl;

import com.lucky.main.dto.CartRequest;
import com.lucky.main.dto.CartResponse;
import com.lucky.main.mapper.CartMapper;
import com.lucky.main.entity.Cart;
import com.lucky.main.entity.CartItem;
import com.lucky.main.entity.Food;
import com.lucky.main.entity.User;
import com.lucky.main.repository.CartItemRepository;
import com.lucky.main.repository.CartRepository;
import com.lucky.main.repository.FoodRepository;
import com.lucky.main.repository.UserRepository;
import com.lucky.main.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final FoodRepository foodRepository;
    private final UserRepository userRepository;

    private Cart getCartByUserId(Long userId) {

        return cartRepository.findByUser_Id(userId)
                .orElseGet(() -> {

                    User user = userRepository.findById(userId)
                            .orElseThrow(() ->
                                    new RuntimeException("User not found"));

                    Cart cart = Cart.builder()
                            .user(user)
                            .cartItems(new ArrayList<>())
                            .build();

                    return cartRepository.save(cart);
                });
    }

    private CartItem getCartItem(Cart cart, Long foodId) {
        return cartItemRepository
                .findByCart_IdAndFood_Id(
                        cart.getId(),
                        foodId
                )
                .orElseThrow(() -> new RuntimeException("Item not found"));
    }

    @Override
    public void addToCart(CartRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Food food = foodRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Food not found"));

        Cart cart = cartRepository.findByUser_Id(user.getId())
                .orElseGet(() -> {

                    Cart newCart = Cart.builder()
                            .user(user)
                            .cartItems(new ArrayList<>())
                            .build();

                    return cartRepository.save(newCart);
                });

        CartItem existingItem = cart.getCartItems()
                .stream()
                .filter(item ->
                        item.getFood().getId().equals(food.getId()))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {

            int newQuantity =
                    existingItem.getQuantity() + request.getQuantity();

            if (newQuantity > food.getStock()) {
                throw new RuntimeException(
                        "Only " + food.getStock() + " items available"
                );
            }

            existingItem.setQuantity(newQuantity);

        } else {

            if (request.getQuantity() > food.getStock()) {
                throw new RuntimeException(
                        "Only " + food.getStock() + " items available"
                );
            }

            CartItem cartItem = CartItem.builder()
                    .food(food)
                    .cart(cart)
                    .quantity(request.getQuantity())
                    .build();

            cart.addItem(cartItem);
        }

        cartRepository.save(cart);
    }

    @Override
    public List<CartResponse> getCart(Long userId) {

        Cart cart = getCartByUserId(userId);

        return cart.getCartItems()
                .stream()
                .map(CartMapper::toResponse)
                .toList();
    }

    @Override
    public void increaseQuantity(Long userId, Long foodId) {

        Cart cart = getCartByUserId(userId);

        CartItem item = getCartItem(cart, foodId);

        if (item.getQuantity() >= item.getFood().getStock()) {
            throw new RuntimeException(
                    "Only " + item.getFood().getStock() + " items available"
            );
        }

        item.setQuantity(item.getQuantity() + 1);

        cartItemRepository.save(item);
    }

    @Override
    public void decreaseQuantity(Long userId, Long foodId) {

        Cart cart = getCartByUserId(userId);

        CartItem item = getCartItem(cart, foodId);

        if (item.getQuantity() > 1) {

            item.setQuantity(item.getQuantity() - 1);

            cartItemRepository.save(item);

        } else {

            cartItemRepository.delete(item);
        }
    }

    @Override
    public void removeItem(Long userId, Long foodId) {

        Cart cart = getCartByUserId(userId);

        CartItem item = getCartItem(cart, foodId);

        cartItemRepository.delete(item);
    }

    @Override
    public void clearCart(Long userId) {

        Cart cart = getCartByUserId(userId);

        cart.getCartItems().clear();

        cartRepository.save(cart);
    }
}