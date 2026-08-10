package com.lucky.main.service;

import com.lucky.main.entity.Order;
import com.lucky.main.entity.User;
import jakarta.servlet.http.HttpServletRequest;

public interface EmailService {

    void sendResetPasswordEmail(User user, String resetLink);

    String generateUrl(HttpServletRequest request);
    void sendOrderConfirmationEmail(Order order);
    String generateResetToken();
}
