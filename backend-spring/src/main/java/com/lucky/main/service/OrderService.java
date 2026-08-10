package com.lucky.main.service;

import com.lucky.main.dto.OrderResponse;
import com.lucky.main.dto.PlaceOrderRequest;
import com.lucky.main.enums.OrderStatus;

import java.util.List;

public interface OrderService {

    List<OrderResponse> getOrdersByUser(Long userId);

    Long placeOrder(PlaceOrderRequest request);

    List<OrderResponse> getAllOrders();

    OrderResponse updateOrderStatus(Long orderId, OrderStatus orderStatus);

    List<OrderResponse> filterOrders(String keyword);

    Double getTotalOrderAmount();
    Long getTotalOrders();
}