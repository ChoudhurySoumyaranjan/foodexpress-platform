package com.lucky.main.service;

import com.lucky.main.dto.OrderResponse;
import com.lucky.main.dto.PlaceOrderRequest;
import com.lucky.main.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface OrderService {

    Page<OrderResponse> getOrdersByUser(Long userId,Pageable pageable);

    Long placeOrder(PlaceOrderRequest request);

    Page<OrderResponse> getAllOrders(Pageable pageable);

    OrderResponse updateOrderStatus(Long orderId, OrderStatus orderStatus);

    Page<OrderResponse> filterOrders(String keyword,Pageable pageable);

    Double getTotalOrderAmount();
    Long getTotalOrders();
}