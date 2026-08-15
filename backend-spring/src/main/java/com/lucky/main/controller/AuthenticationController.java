package com.lucky.main.controller;

import com.lucky.main.dto.*;
import com.lucky.main.enums.Role;
import com.lucky.main.entity.User;
import com.lucky.main.exception.UserNotFoundException;
import com.lucky.main.service.AuthenticationService;
import com.lucky.main.service.JwtService;
import com.lucky.main.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Set;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final UserService userService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Value("${security.jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request)
            throws UserNotFoundException, IOException {

        UserResponse response = userService.addUser(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationHandlerResponse> login(@RequestBody AuthenticationRequest request) {

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userService.getUserByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDetails userDetails = (UserDetails) auth.getPrincipal();

        String accessToken = jwtService.generateAccessToken(userDetails, user);
        String refreshToken = jwtService.createRefreshToken(user); // generates + saves

        // HttpOnly cookie for refresh token
        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(false) // localhost only
                .path("/")
                .sameSite("Lax")
                .maxAge(refreshTokenExpiration / 1000)
                .build();

        UserResponse userResponse = UserResponse.builder()
                .id(user.getId())
                .name(user.getFirstName() + " " + user.getLastName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .isEnabled(user.isEnabled())
                .address(user.getAddress())
                .createAt(user.getCreatedAt())
                .updateAt(user.getUpdatedAt())
                .roles(user.getRoles())
                .build();

        AuthenticationHandlerResponse response = AuthenticationHandlerResponse.builder()
                .accessToken(accessToken)
                .tokenType("Bearer")
                .user(userResponse)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString()) //Sending Refresh token in Cookie Header,
                .body(response); //sending access token in response body
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthenticationHandlerResponse> refreshToken(
            @CookieValue(value = "refreshToken", required = false) String refreshToken) {

        if (refreshToken == null || refreshToken.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        AuthenticationResponse response =
                authenticationService.refreshToken(refreshToken);
        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", response.getRefreshToken())
                .httpOnly(true)
                .secure(false)
                .path("/")
                .sameSite("Lax")
                .maxAge(refreshTokenExpiration / 1000)
                .build();

        AuthenticationHandlerResponse responseBody = AuthenticationHandlerResponse.builder()
                .accessToken(response.getAccessToken())
                .tokenType(response.getTokenType())
                .user(response.getUser())
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(responseBody);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(
            @CookieValue(value = "refreshToken", required = false) String refreshToken) {

        if (refreshToken != null && !refreshToken.isEmpty()) {
            jwtService.findRefreshToken(refreshToken)
                    .ifPresent(jwtService::deleteRefreshToken);
        }

        // Invalidating cookie
        ResponseCookie deleteCookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, deleteCookie.toString())
                .body("Logged out successfully");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request,
            HttpServletRequest httpServletRequest) {

        authenticationService.forgotPassword(
                request.getEmail().toLowerCase(),
                httpServletRequest
        );

        return ResponseEntity.ok(
                "Password reset email has been sent."
        );
    }
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        authenticationService.resetPassword(request);

        return ResponseEntity.ok("Password has been reset successfully.");
    }
}