package com.lucky.main.service.impl;

import com.lucky.main.entity.Order;
import com.lucky.main.entity.OrderItem;
import com.lucky.main.entity.User;
import com.lucky.main.service.EmailService;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Override
    public void sendResetPasswordEmail(User user, String resetLink) {

        try {
            String html = loadTemplate("templates/reset-password.html");

            html = html.replace("{{name}}", user.getFirstName()+" "+user.getLastName());
            html = html.replace("{{resetLink}}", resetLink);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(user.getEmail());
            helper.setFrom("choudhurysoumya87@gmail.com");
            helper.setSubject("Reset Your Password");
            helper.setText(html, true);

            mailSender.send(message);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private String loadTemplate(String path) throws IOException {
        ClassPathResource resource = new ClassPathResource(path);

        return new String(
                resource.getInputStream().readAllBytes(),
                StandardCharsets.UTF_8
        );
    }

    @Override
    public  String generateUrl(HttpServletRequest request){

        String siteUrl=request.getRequestURL().toString(); //http://localhost:1010/xyz

        //before Servlet Path= /xyz

        String url =siteUrl.replace(request.getServletPath(),"");

        //after path = /

        //now http://localhost:1010

        return url;
    }

    @Override
    public String generateResetToken(){
        return UUID.randomUUID().toString();
    }

    @Override
    public void sendOrderConfirmationEmail(Order order) {

        try {

            String html = loadTemplate("templates/order-confirmation.html");

            html = html.replace(
                    "{{name}}",
                    order.getUser().getFirstName() + " " +
                            order.getUser().getLastName()
            );

            html = html.replace(
                    "{{orderId}}",
                    String.valueOf(order.getId())
            );

            html = html.replace(
                    "{{orderDate}}",
                    order.getOrderDate().toString()
            );

            html = html.replace(
                    "{{status}}",
                    order.getStatus().name()
            );

            html = html.replace(
                    "{{paymentMethod}}",
                    order.getPaymentMethod().name()
            );

            html = html.replace(
                    "{{deliveryAddress}}",
                    order.getDeliveryAddress()
            );

            html = html.replace(
                    "{{totalAmount}}",
                    String.format("₹%.2f", order.getTotalAmount())
            );

            // Generate Order Items Table
            StringBuilder items = new StringBuilder();

            for (OrderItem item : order.getOrderItems()) {

                items.append(String.format("""
                    <tr>
                        <td style="padding:10px;border:1px solid #ddd;">%s</td>
                        <td style="padding:10px;border:1px solid #ddd;text-align:center;">%d</td>
                        <td style="padding:10px;border:1px solid #ddd;text-align:right;">₹%.2f</td>
                    </tr>
                    """,
                        item.getFood().getFoodName(),
                        item.getQuantity(),
                        item.getPrice()
                ));
            }

            html = html.replace(
                    "{{orderItems}}",
                    items.toString()
            );

            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("choudhurysoumya87@gmail.com");
            helper.setTo(order.getUser().getEmail());
            helper.setSubject("Your Order Has Been Placed Successfully");
            helper.setText(html, true);

            mailSender.send(message);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
