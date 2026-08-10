package com.lucky.main.controller;

import com.lucky.main.dto.*;
import com.lucky.main.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin/api/analytics")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminAnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/revenue/last7days")
    public ResponseEntity<List<RevenueChartDTO>> getRevenueLast7Days() {

        return ResponseEntity.ok(
                analyticsService.getRevenueLast7Days()
        );
    }
    @GetMapping("/order-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderStatusChartDTO>> getOrderStatusChart() {

        return ResponseEntity.ok(
                analyticsService.getOrderStatusChart()
        );

    }
    @GetMapping("/recent-orders")
    public ResponseEntity<List<RecentOrderDTO>> getRecentOrders() {

        return ResponseEntity.ok(
                analyticsService.getRecentOrders()
        );

    }
    @GetMapping("/top-selling-foods")
    public ResponseEntity<List<TopSellingFoodDTO>> getTopSellingFoods() {

        return ResponseEntity.ok(
                analyticsService.getTopSellingFoods()
        );

    }
    @GetMapping("/recent-users")
    public ResponseEntity<List<RecentUserDTO>> getRecentUsers() {

        return ResponseEntity.ok(
                analyticsService.getRecentUsers()
        );

    }@GetMapping("/recent-queries")
    public ResponseEntity<List<RecentQueryDTO>> getRecentQueries() {

        return ResponseEntity.ok(
                analyticsService.getRecentQueries()
        );
    }
}
