package com.lucky.main.service;

import com.lucky.main.dto.*;

import java.util.List;

public interface AnalyticsService {
    List<RevenueChartDTO> getRevenueLast7Days();
    List<OrderStatusChartDTO> getOrderStatusChart();
    List<RecentOrderDTO> getRecentOrders();
    List<TopSellingFoodDTO> getTopSellingFoods();
    List<RecentUserDTO> getRecentUsers();
    List<RecentQueryDTO> getRecentQueries();
}
