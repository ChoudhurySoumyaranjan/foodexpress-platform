package com.lucky.main.mapper;

import com.lucky.main.dto.CartResponse;
import com.lucky.main.entity.CartItem;

public class CartMapper {

    private CartMapper() {
    }

    public static CartResponse toResponse(CartItem cartItem) {

        return CartResponse.builder()
                .foodId(cartItem.getFood().getId())
                .foodName(cartItem.getFood().getFoodName())
                .imageUrl(cartItem.getFood().getImageUrl())
                .originalPrice(cartItem.getFood().getPrice())
                .discountedPrice(cartItem.getFood().getDiscountedPrice())
                .stock(cartItem.getFood().getStock())
                .quantity(cartItem.getQuantity())
                .totalPrice(
                        cartItem.getFood().getDiscountedPrice()
                                * cartItem.getQuantity()
                )
                .build();
    }

    public static CartItem toEntity() {
        throw new UnsupportedOperationException(
                "Use Builder Pattern for CartItem creation"
        );
    }
}