package com.lucky.main.service.impl;

import com.lucky.main.dto.*;
import com.lucky.main.entity.Order;
import com.lucky.main.enums.PaymentStatus;
import com.lucky.main.repository.ContactMessageRepository;
import com.lucky.main.repository.OrderItemRepository;
import com.lucky.main.repository.OrderRepository;
import com.lucky.main.repository.UserRepository;
import com.lucky.main.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final ContactMessageRepository contactMessageRepository;

    @Override
    @Cacheable(value = "revenueAnalytics",key = "'last7days'")
    public List<RevenueChartDTO> getRevenueLast7Days() {

        LocalDate today = LocalDate.now();

        LocalDateTime startDate = today.minusDays(6).atStartOfDay();

        List<Order> orders = orderRepository
                .findByOrderDateAfterAndPaymentStatusOrderByOrderDateAsc(
                        startDate,
                        PaymentStatus.SUCCESS
                );

        Map<LocalDate, Double> revenueMap = new LinkedHashMap<>();

        // Initialize all last 7 days with 0 revenue
        for (int i = 6; i >= 0; i--) {
            revenueMap.put(today.minusDays(i), 0.0);
        }

        // Sum revenue
        for (Order order : orders) {

            LocalDate date = order.getOrderDate().toLocalDate();

            revenueMap.put(
                    date,
                    revenueMap.get(date) + order.getTotalAmount()
            );
        }

        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("EEE");

        List<RevenueChartDTO> response = new ArrayList<>();

        revenueMap.forEach((date, revenue) -> {

            response.add(
                    new RevenueChartDTO(
                            date.format(formatter),
                            revenue
                    )
            );

        });

        return response;
    }
    @Override
    @Cacheable(value = "orderStatusAnalytics",key = "'orderStatus'")
    public List<OrderStatusChartDTO> getOrderStatusChart() {

        List<Object[]> result = orderRepository.getOrderStatusCount();

        return result.stream()
                .map(obj -> new OrderStatusChartDTO(
                        obj[0].toString(),
                        (Long) obj[1]
                ))
                .collect(Collectors.toList());

    }
    @Override
    @Cacheable(value = "orderAnalytics",key = "'lastOrders'")
    public List<RecentOrderDTO> getRecentOrders() {

        return orderRepository.findTop5ByOrderByOrderDateDesc()
                .stream()
                .map(order -> new RecentOrderDTO(
                        order.getId(),
                        order.getCustomerName(),
                        order.getTotalAmount(),
                        order.getStatus(),
                        order.getOrderDate()
                ))
                .toList();

    }
    @Override
    @Cacheable(value = "topSellingAnalytics",key = "'topSold'")
    public List<TopSellingFoodDTO> getTopSellingFoods() {

        return orderItemRepository.findTopSellingFoods(
                PageRequest.of(0, 5)
        );
    }

    @Override
    public List<RecentUserDTO> getRecentUsers() {

        return userRepository.findRecentUsers(
                PageRequest.of(0, 5)
        );

    }
    @Override
    @Cacheable(value = "recentQueryAnalytics",key = "'latestQuery'")
    public List<RecentQueryDTO> getRecentQueries() {

        Pageable pageable = PageRequest.of(0, 5);

        return contactMessageRepository.findRecentQueries(pageable);
    }
}