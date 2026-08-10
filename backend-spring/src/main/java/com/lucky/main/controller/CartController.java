package com.lucky.main.controller;

import com.lucky.main.dto.CartRequest;
import com.lucky.main.dto.CartResponse;
import com.lucky.main.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping("/add")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> addToCart(
            @RequestBody CartRequest request
    ) {

        cartService.addToCart(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("Item added to cart successfully");
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<CartResponse>> getCart(
            @PathVariable Long userId
    ) {

        return ResponseEntity.ok(
                cartService.getCart(userId)
        );
    }

    @PutMapping("/increase/{userId}/{foodId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> increaseQuantity(
            @PathVariable Long userId,
            @PathVariable Long foodId
    ) {

        cartService.increaseQuantity(userId, foodId);

        return ResponseEntity.ok(
                "Quantity increased successfully"
        );
    }

    @PutMapping("/decrease/{userId}/{foodId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> decreaseQuantity(
            @PathVariable Long userId,
            @PathVariable Long foodId
    ) {

        cartService.decreaseQuantity(userId, foodId);

        return ResponseEntity.ok(
                "Quantity decreased successfully"
        );
    }

    @DeleteMapping("/{userId}/{foodId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> removeItem(
            @PathVariable Long userId,
            @PathVariable Long foodId
    ) {

        cartService.removeItem(userId, foodId);

        return ResponseEntity.ok(
                "Item removed from cart successfully"
        );
    }

    @DeleteMapping("/clear/{userId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> clearCart(
            @PathVariable Long userId
    ) {

        cartService.clearCart(userId);

        return ResponseEntity.ok(
                "Cart cleared successfully"
        );
    }
}