package com.lucky.main.service;

import com.lucky.main.dto.OrderResponse;
import com.lucky.main.dto.PageResponse;
import com.lucky.main.dto.PlaceOrderRequest;
import com.lucky.main.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface OrderService {

    PageResponse<OrderResponse> getOrdersByUser(Long userId,Pageable pageable);

    Long placeOrder(PlaceOrderRequest request);

    PageResponse<OrderResponse> getAllOrders(Pageable pageable);

    OrderResponse updateOrderStatus(Long orderId, OrderStatus orderStatus);

    PageResponse<OrderResponse> filterOrders(String keyword,Pageable pageable);

    Double getTotalOrderAmount();
    Long getTotalOrders();
}