package com.lucky.main.service.impl;

import com.lucky.main.dto.OrderResponse;
import com.lucky.main.dto.PlaceOrderRequest;
import com.lucky.main.entity.*;
import com.lucky.main.enums.OrderStatus;
import com.lucky.main.enums.PaymentStatus;
import com.lucky.main.enums.PaymentType;
import com.lucky.main.mapper.OrderMapper;
import com.lucky.main.mapper.UserMapper;
import com.lucky.main.repository.CartRepository;
import com.lucky.main.repository.FoodRepository;
import com.lucky.main.repository.OrderRepository;
import com.lucky.main.repository.UserRepository;
import com.lucky.main.service.EmailService;
import com.lucky.main.service.OrderService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final FoodRepository foodRepository;
    private final EmailService emailService;

    @Override
    @Transactional
    public List<OrderResponse> getOrdersByUser(Long userId) {

        userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return orderRepository
                .findByUser_IdOrderByOrderDateDesc(userId)
                .stream()
                .map(OrderMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public Long placeOrder(PlaceOrderRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUser_Id(request.getUserId())
                .orElseThrow(() ->
                        new RuntimeException("Cart not found"));

        if (cart.getCartItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = Order.builder()
                .user(user)
                .customerName(request.getCustomerName())
                .phoneNumber(request.getPhoneNumber())
                .paymentMethod(request.getPaymentMethod())
                .deliveryAddress(request.getDeliveryAddress())
                .status(OrderStatus.PLACED)
                .paymentStatus(
                        request.getPaymentMethod() == PaymentType.CASH_ON_DELIVERY
                                ? PaymentStatus.PENDING
                                : PaymentStatus.SUCCESS
                )
                .razorpayOrderId(request.getRazorpayOrderId())
                .razorpayPaymentId(request.getRazorpayPaymentId())
                .razorpaySignature(request.getRazorpaySignature())
                .build();

        double totalAmount = 0;

        for (CartItem cartItem : cart.getCartItems()) {

            double price = Math.round(
                    cartItem.getFood().getDiscountedPrice() * 100.0
            ) / 100.0;

            if (cartItem.getFood().getStock() < cartItem.getQuantity()) {
                throw new RuntimeException("Insufficient stock");
            } else {
                Food food = foodRepository.findById(
                                cartItem.getFood().getId())
                        .orElseThrow(() -> new RuntimeException("Food not found"));

                if (food.getStock() < cartItem.getQuantity()) {
                    throw new RuntimeException("Insufficient stock");
                }

                food.setStock(
                        food.getStock() - cartItem.getQuantity()
                );
            }

            OrderItem orderItem = OrderItem.builder()
                    .food(cartItem.getFood())
                    .quantity(cartItem.getQuantity())
                    .price(price)
                    .build();

            order.addItem(orderItem);

            totalAmount += price * cartItem.getQuantity();
        }

        totalAmount = Math.round(totalAmount * 100.0) / 100.0;

        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);

        cart.getCartItems().clear();

        cartRepository.save(cart);

        try {
            emailService.sendOrderConfirmationEmail(savedOrder);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return savedOrder.getId();
    }

    @Override
    @Transactional
    public Page<OrderResponse> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable)
                .map((order) -> OrderMapper.toResponse(order));
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus newStatus) {

        Order existingOrder = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        OrderStatus currentStatus = existingOrder.getStatus();

        if (currentStatus == OrderStatus.CANCELLED) {
            throw new RuntimeException("Cancelled order cannot be updated");
        }

        if (currentStatus == OrderStatus.DELIVERED) {
            throw new RuntimeException("Delivered order cannot be updated");
        }

        if (newStatus == OrderStatus.CANCELLED) {
            existingOrder.setStatus(OrderStatus.CANCELLED);
            return OrderMapper.toResponse(existingOrder);
        }

        int currentOrdinal = currentStatus.ordinal();
        int newOrdinal = newStatus.ordinal();

        if (newOrdinal != currentOrdinal + 1) {
            throw new RuntimeException(
                    "Invalid status transition from "
                            + currentStatus
                            + " to "
                            + newStatus
            );
        }

        if (newStatus == OrderStatus.DELIVERED) {
            existingOrder.setPaymentStatus(PaymentStatus.SUCCESS);
        }
        existingOrder.setStatus(newStatus);

        return OrderMapper.toResponse(existingOrder);
    }

    @Override
    @Transactional
    public Page<OrderResponse> filterOrders(String keyword,Pageable pageable) {

        if (keyword == null || keyword.isBlank()) {
            return orderRepository.findAll(pageable)
                    .map((order) -> OrderMapper.toResponse(order));
        }
        return orderRepository.searchOrders(keyword.trim(),pageable)
                .map((order) -> OrderMapper.toResponse(order));
    }

    @Override
    public Double getTotalOrderAmount() {
        return orderRepository.getTotalOrderAmount();
    }

    @Override
    public Long getTotalOrders() {
        return orderRepository.count();
    }
}