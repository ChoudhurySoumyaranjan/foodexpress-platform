package com.lucky.main.service;

import com.lucky.main.dto.ChangePasswordRequest;
import com.lucky.main.dto.UpdateUserDetailsRequest;
import com.lucky.main.dto.UserResponse;
import com.lucky.main.enums.Role;
import com.lucky.main.entity.User;
import com.lucky.main.exception.UserNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface UserService {
    Page<UserResponse> getAllUsers(Pageable pageable);

    Optional<User> addUser(User user) throws IOException;

    void deleteUser(Long id) throws UserNotFoundException;

    User findUser(Long id) throws UserNotFoundException;

    UserResponse updateUser(Long id, UpdateUserDetailsRequest userDetailsRequest) throws UserNotFoundException;

    UserResponse blockUser(Long id) throws UserNotFoundException;

    UserResponse unBlockUser(Long id) throws UserNotFoundException;

    Optional<User> getUserByEmail(String email);

    List<UserResponse> filterUsers(String keyword);

    UserResponse changeAccountPassword(
            ChangePasswordRequest request,
            Long userId
    ) throws UserNotFoundException;
    Long countPeopleWhichRoleUser(Role role);
}

