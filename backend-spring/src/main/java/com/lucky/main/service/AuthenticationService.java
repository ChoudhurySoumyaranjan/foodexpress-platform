package com.lucky.main.service;

import com.lucky.main.dto.AuthenticationResponse;
import com.lucky.main.dto.ResetPasswordRequest;
import com.lucky.main.dto.UserResponse;
import com.lucky.main.entity.PasswordResetToken;
import com.lucky.main.entity.User;
import com.lucky.main.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;

import static com.lucky.main.utils.CommonUtils.generateUrl;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final PasswordResetTokenService passwordResetTokenService;
    private final EmailService emailService;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    public AuthenticationResponse refreshToken(String refreshToken) {

        return jwtService.findRefreshToken(refreshToken)
                .map(token -> {

                    if (token.getExpiryDate().isBefore(Instant.now())) {
                        jwtService.deleteRefreshToken(token); // delete expired
                        throw new RuntimeException("Refresh token expired");
                    }

                    User user = token.getUser();

                    // DELETE OLD REFRESH TOKEN (rotation)
                    jwtService.deleteRefreshToken(token);

                    // GENERATE NEW REFRESH TOKEN
                    String newRefreshToken = jwtService.createRefreshToken(user);

                    // Load UserDetails
                    UserDetails userDetails = org.springframework.security.core.userdetails.User
                            .withUsername(user.getEmail())
                            .password(user.getPassword())
                            .authorities(
                                    user.getRoles()
                                            .stream()
                                            .map(role -> "ROLE_" + role.name())
                                            .toArray(String[]::new)
                            )
                            .build();

                    // Generate new access token
                    String newAccessToken =
                            jwtService.generateAccessToken(userDetails, user);

                    return AuthenticationResponse.builder()
                            .accessToken(newAccessToken)
                            .refreshToken(newRefreshToken) // NEW token here
                            .tokenType("Bearer")
                            .user(
                                    UserResponse.builder()
                                            .id(user.getId())
                                            .name(user.getFirstName() + " " + user.getLastName())
                                            .email(user.getEmail())
                                            .phoneNumber(user.getPhoneNumber())
                                            .updateAt(user.getUpdatedAt())
                                            .createAt(user.getCreatedAt())
                                            .phoneNumber(user.getPhoneNumber())
                                            .address(user.getAddress())
                                            .roles(user.getRoles())
                                            .build()
                            )
                            .build();
                })
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));
    }

    public void forgotPassword(String email,
                               HttpServletRequest request) {

        User user = userService.getUserByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        PasswordResetToken resetToken =
                passwordResetTokenService.createToken(user);

        // baseUrl = generateUrl(request);

        String resetLink =
                frontendUrl +
                        "/api/auth/reset-password?token=" +
                        resetToken.getToken();

        emailService.sendResetPasswordEmail(user, resetLink);
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {

        PasswordResetToken resetToken = passwordResetTokenService
                .findByToken(request.getToken())
                .orElseThrow(() ->
                        new RuntimeException("Invalid reset token"));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {

            passwordResetTokenService.delete(resetToken);

            throw new RuntimeException("Reset token has expired.");
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match.");
        }

        User user = resetToken.getUser();

        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);

        passwordResetTokenService.delete(resetToken);
    }

}