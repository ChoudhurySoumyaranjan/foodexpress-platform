package com.lucky.main.controller;

import com.lucky.main.dto.ChangePasswordRequest;
import com.lucky.main.dto.UpdateUserDetailsRequest;
import com.lucky.main.dto.UserResponse;
import com.lucky.main.exception.UserNotFoundException;
import com.lucky.main.mapper.UserMapper;
import com.lucky.main.service.JwtService;
import com.lucky.main.service.OrderService;
import com.lucky.main.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    public final UserService userService;
    public final JwtService jwtService;
    public final PasswordEncoder passwordEncoder;
    public final OrderService orderService;

    @GetMapping
    public ResponseEntity<UserResponse> getUserDetails(@RequestHeader("Authorization") String authHeader) throws UserNotFoundException {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid Authorization header");
        }

        String token = authHeader.substring(7);
        Long userId = jwtService.extractUserId(token);

        com.lucky.main.entity.User user = userService.findUser(userId);

        return ResponseEntity.ok(UserMapper.toResponse(user));

    }

    @PutMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UserResponse> updateUserDetails(@RequestHeader("Authorization") String authHeader,
                                                          @RequestBody UpdateUserDetailsRequest userDetailsRequest)
            throws UserNotFoundException {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid Authorization header");
        }

        //System.out.println(userDetailsRequest);
        String token = authHeader.substring(7);
        Long userId = jwtService.extractUserId(token);


        System.out.println("JWT User ID = " + userId);
        UserResponse userResponse = userService.updateUser(userId, userDetailsRequest);

        return ResponseEntity.ok(userResponse);
    }

    @PostMapping("/password")
    public ResponseEntity<UserResponse> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            @RequestHeader("Authorization") String authHeader
    ) throws UserNotFoundException {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid Authorization Header");
        }

        String token = authHeader.substring(7);

        Long userId = jwtService.extractUserId(token);

        UserResponse response = userService.changeAccountPassword(
                request,
                userId
        );

        return ResponseEntity.ok(response);
    }
}
