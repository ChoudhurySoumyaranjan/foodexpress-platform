package com.lucky.main.controller;

import com.lucky.main.dto.OrderResponse;
import com.lucky.main.dto.PlaceOrderRequest;
import com.lucky.main.enums.OrderStatus;
import com.lucky.main.enums.PaymentType;
import com.lucky.main.service.JwtService;
import com.lucky.main.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final JwtService jwtService;
    private final OrderService orderService;

    @PostMapping("/place")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> placeOrder(
            @RequestBody @Valid PlaceOrderRequest request
    ) {

        Long orderId =
                orderService.placeOrder(request);

        return ResponseEntity.ok(
                "Order Placed Successfully. Order ID: "
                        + orderId
        );
    }

    @GetMapping
    //@PreAuthorize("hasRole('USER')")
    public ResponseEntity<Page<OrderResponse>> getOrdersByUser(
            @RequestHeader("Authorization") String authHeader,
            @PageableDefault(size = 5, sort = "id") Pageable pageable
    ) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid Authorization header");
        }

        String token = authHeader.substring(7);
        Long userId = jwtService.extractUserId(token);

        return ResponseEntity.ok(
                orderService.getOrdersByUser(userId, pageable)
        );
    }


    @GetMapping("/statuses")
    public ResponseEntity<List<String>> getAllStatuses() {

        List<String> statuses = Arrays.stream(OrderStatus.values())
                .map(Enum::name)
                .toList();
        return ResponseEntity.ok(statuses);
    }

    @GetMapping("/payment/types")
    public ResponseEntity<List<String>> getAllPaymentTypes() {

        List<String> paymentTypes = Arrays.stream(PaymentType.values())
                .map(Enum::name)
                .toList();
        return ResponseEntity.ok(paymentTypes);
    }

}