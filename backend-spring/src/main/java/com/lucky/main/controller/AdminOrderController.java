package com.lucky.main.controller;

import com.lucky.main.dto.OrderResponse;
import com.lucky.main.dto.UserResponse;
import com.lucky.main.enums.OrderStatus;
import com.lucky.main.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/api/orders")
@PreAuthorize("hasRole('ADMIN')")
public class AdminOrderController {
    private final OrderService orderService;

    @PatchMapping("/{orderId}")
    public ResponseEntity<OrderResponse> updateOrderStatus(@PathVariable Long orderId, @RequestParam OrderStatus status){
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }

    @GetMapping("/all")

    public ResponseEntity<List<OrderResponse>> getAllOrders(){
        return ResponseEntity.ok(
                orderService.getAllOrders());
    }
    @GetMapping
    public ResponseEntity<List<OrderResponse>> filterOrders(@RequestParam("keyword") String keyword)
    {
        return ResponseEntity.ok(orderService.filterOrders(keyword));
    }

    @GetMapping("/amount")
    public ResponseEntity<Double> getTotalOrderAmount(){
        return ResponseEntity.ok(orderService.getTotalOrderAmount());
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getTotalOrderOrders(){
        return ResponseEntity.ok(orderService.getTotalOrders());
    }
}
