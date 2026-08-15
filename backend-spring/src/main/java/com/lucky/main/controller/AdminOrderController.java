package com.lucky.main.controller;

import com.lucky.main.dto.OrderResponse;
import com.lucky.main.enums.OrderStatus;
import com.lucky.main.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/api/orders")
@PreAuthorize("hasRole('ADMIN')")
public class AdminOrderController {
    private final OrderService orderService;

    @PatchMapping("/{orderId}")
    public ResponseEntity<OrderResponse> updateOrderStatus(@PathVariable Long orderId, @RequestParam OrderStatus status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }

    @GetMapping("/all")
    public ResponseEntity<Page<OrderResponse>> getAllOrders(
            @PageableDefault(
                    size = 5,
                    sort = "orderDate",
                    direction = Sort.Direction.DESC
            ) Pageable pageable) {
        return ResponseEntity.ok(
                orderService.getAllOrders(pageable));
    }

    @GetMapping
    public ResponseEntity<Page<OrderResponse>> filterOrders(@PageableDefault(size = 5, sort = "id") Pageable pageable, @RequestParam("keyword") String keyword) {
        return ResponseEntity.ok(orderService.filterOrders(keyword, pageable));
    }

    @GetMapping("/amount")
    public ResponseEntity<Double> getTotalOrderAmount() {
        return ResponseEntity.ok(orderService.getTotalOrderAmount());
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getTotalOrderOrders() {
        return ResponseEntity.ok(orderService.getTotalOrders());
    }
}
