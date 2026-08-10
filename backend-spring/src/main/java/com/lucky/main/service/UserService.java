package com.lucky.main.service;

import com.lucky.main.dto.ChangePasswordRequest;
import com.lucky.main.dto.UpdateUserDetailsRequest;
import com.lucky.main.dto.UserResponse;
import com.lucky.main.entity.Role;
import com.lucky.main.entity.User;
import com.lucky.main.exception.UserNotFoundException;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface UserService {
    List<UserResponse> getAllUsers();

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

