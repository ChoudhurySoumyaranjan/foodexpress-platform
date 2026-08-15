package com.lucky.main.controller;

import com.lucky.main.dto.UserResponse;
import com.lucky.main.enums.Role;
import com.lucky.main.exception.UserNotFoundException;
import com.lucky.main.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/api/user")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {
    private final UserService userService;

    @GetMapping
    public ResponseEntity<Page<UserResponse>> getAllUsers(
            @PageableDefault(size = 10,sort = "id") Pageable pageable
    ) {
        return ResponseEntity.ok(userService.getAllUsers(pageable));
    }

    @PatchMapping("/block/{id}")
    public ResponseEntity<UserResponse> blockUser(@PathVariable Long id) throws UserNotFoundException {
        return ResponseEntity.ok(userService.blockUser(id));
    }

    @GetMapping("/{keyword}")
    public ResponseEntity<List<UserResponse>> filterUsers(@PathVariable String keyword) {
        return ResponseEntity.ok(userService.filterUsers(keyword));
    }

    @PatchMapping("/unblock/{id}")
    public ResponseEntity<UserResponse> unBlockUser(@PathVariable Long id) throws UserNotFoundException {
        return ResponseEntity.ok(userService.unBlockUser(id));
    }

    @GetMapping("/count")
    public ResponseEntity<Long> countUser() {
        return ResponseEntity.ok(userService.countPeopleWhichRoleUser(Role.USER));
    }

}
