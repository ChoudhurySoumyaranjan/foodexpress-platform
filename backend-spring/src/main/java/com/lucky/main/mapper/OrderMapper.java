package com.lucky.main.mapper;

import com.lucky.main.dto.OrderItemResponse;
import com.lucky.main.dto.OrderResponse;
import com.lucky.main.entity.Order;
import com.lucky.main.entity.OrderItem;

import java.util.List;

public class  OrderMapper {

    public static OrderResponse toResponse(Order order) {

        List<OrderItemResponse> items =
                order.getOrderItems()
                        .stream()
                        .map(OrderMapper::toItemResponse)
                        .toList();

        return OrderResponse.builder()
                .orderId(order.getId())
                .totalAmount(order.getTotalAmount())
                .razorpayOrderId(order.getRazorpayOrderId())
                .razorpayPaymentId(order.getRazorpayPaymentId())
                .status(order.getStatus())
                .paymentStatus(order.getPaymentStatus())
                .customerName(order.getCustomerName())
                .phoneNumber(order.getPhoneNumber())
                .paymentMethod(order.getPaymentMethod())
                .deliveryAddress(order.getDeliveryAddress())
                .orderDate(order.getOrderDate())
                .items(items)
                .build();
    }

    public static OrderItemResponse toItemResponse(
            OrderItem item
    ) {
        return OrderItemResponse.builder()
                .foodId(item.getFood().getId())
                .foodName(item.getFood().getFoodName())
                .imageUrl(item.getFood().getImageUrl())
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .totalPrice(
                        item.getPrice() * item.getQuantity()
                )
                .build();
    }
}
