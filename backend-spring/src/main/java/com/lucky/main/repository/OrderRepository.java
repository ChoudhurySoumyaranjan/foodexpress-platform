package com.lucky.main.repository;

import com.lucky.main.entity.Order;
import com.lucky.main.enums.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository
        extends JpaRepository<Order, Long> {

    Page<Order> findByUser_IdOrderByOrderDateDesc(
            Long userId,
            Pageable pageable
    );

    @Query("""
            SELECT o
            FROM Order o
            WHERE LOWER(o.razorpayOrderId) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(o.razorpayPaymentId) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(o.customerName) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR o.phoneNumber LIKE CONCAT('%', :keyword, '%')
            ORDER BY o.orderDate DESC
            """)
    Page<Order> searchOrders(
            @Param("keyword") String keyword,
            Pageable pageable
    );

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o")
    Double getTotalOrderAmount();

    List<Order> findByOrderDateAfterAndPaymentStatusOrderByOrderDateAsc(
            LocalDateTime date,
            PaymentStatus paymentStatus
    );

    @Query("""
            SELECT o.status, COUNT(o)
            FROM Order o
            GROUP BY o.status
            """)
    List<Object[]> getOrderStatusCount();

    List<Order> findTop5ByOrderByOrderDateDesc();
}