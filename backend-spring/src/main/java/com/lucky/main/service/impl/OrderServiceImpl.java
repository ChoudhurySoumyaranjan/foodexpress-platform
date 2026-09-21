package com.lucky.main.service.impl;

import com.lucky.main.dto.OrderResponse;
import com.lucky.main.dto.PageResponse;
import com.lucky.main.dto.PlaceOrderRequest;
import com.lucky.main.entity.*;
import com.lucky.main.enums.OrderStatus;
import com.lucky.main.enums.PaymentStatus;
import com.lucky.main.enums.PaymentType;
import com.lucky.main.mapper.OrderMapper;
import com.lucky.main.repository.CartRepository;
import com.lucky.main.repository.FoodRepository;
import com.lucky.main.repository.OrderRepository;
import com.lucky.main.repository.UserRepository;
import com.lucky.main.service.EmailService;
import com.lucky.main.service.OrderService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

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
    @Cacheable(value = "userOrders", key = "#userId + ':' + #pageable.pageNumber + ':' + #pageable.pageSize")
    public PageResponse<OrderResponse> getOrdersByUser(Long userId, Pageable pageable) {

        userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Page<OrderResponse> page =
                orderRepository.findByUser_IdOrderByOrderDateDesc(userId, pageable) //Page<Order>
                        .map(OrderMapper::toResponse); //Page<OrderResponse>

        return new PageResponse<>(  //PageResponse<OrderResponse>
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast()
        );
    }

    @Override
    @Transactional
    @Caching(
            evict = {
                    @CacheEvict(value = "userOrders", allEntries = true),
                    @CacheEvict(value = "paginatedOrders", allEntries = true),
                    @CacheEvict(value = "filteredOrders", allEntries = true),
                    @CacheEvict(value = {
                            "revenueAnalytics",
                            "orderStatusAnalytics",
                            "orderAnalytics",
                            "topSellingAnalytics"
                    }, allEntries = true)
            }
    )
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
    @Cacheable(value = "paginatedOrders", key = "#pageable.pageNumber +' - '+ #pageable.pageSize")
    public PageResponse<OrderResponse> getAllOrders(Pageable pageable) {
        Page<OrderResponse> page = orderRepository.findAll(pageable)  //Page<Orders>
                .map((order) -> OrderMapper.toResponse(order));  //Page<OrderResponse>
        return new PageResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast());

        // returning Page<OrderResponse> works perfectly.
        // However, when we directly cache Page<OrderResponse>
        // in Redis, Spring Data usually uses the PageImpl implementation internally.
        // GenericJackson2JsonRedisSerializer can serialize this object, but when reading it back from Redis,
        // Jackson may not know how to reconstruct the PageImpl object.
    }

    @Override
    @Transactional
    @Caching(
            evict = {
                    @CacheEvict(value = "userOrders", allEntries = true),
                    @CacheEvict(value = "paginatedOrders", allEntries = true),
                    @CacheEvict(value = "filteredOrders", allEntries = true),
                    @CacheEvict(value = "orderStatusAnalytics", allEntries = true),
                    @CacheEvict(value = "orderAnalytics", allEntries = true),
                    @CacheEvict(value = "revenueAnalytics", allEntries = true)
            }
    )
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
    @Cacheable(value = "filteredOrders",
            key = "#pageable.pageNumber + ':' + #pageable.pageSize + ':' + (#keyword == null ? '' : #keyword.trim())")
    public PageResponse<OrderResponse> filterOrders(String keyword, Pageable pageable) {

        if (keyword == null || keyword.isBlank()) {
            Page<OrderResponse> page = orderRepository.findAll(pageable) //Page<Order>
                    .map((order) -> OrderMapper.toResponse(order)); //Page<OrderResponse>
            return new PageResponse<>( //PageResponse<OrderResponse>
                    page.getContent(),
                    page.getNumber(),
                    page.getSize(),
                    page.getTotalElements(),
                    page.getTotalPages(),
                    page.isFirst(),
                    page.isLast()
            );
        }
        Page<OrderResponse> page = orderRepository.searchOrders(keyword.trim(), pageable) //Page<Order>
                .map((order) -> OrderMapper.toResponse(order)); //Page<OrderResponse>
        return new PageResponse<>( //PageResponse<OrderResponse>
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast()
        );
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