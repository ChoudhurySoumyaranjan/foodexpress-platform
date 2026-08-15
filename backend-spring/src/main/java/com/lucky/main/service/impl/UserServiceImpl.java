package com.lucky.main.service.impl;

import com.lucky.main.dto.ChangePasswordRequest;
import com.lucky.main.dto.RegisterRequest;
import com.lucky.main.dto.UpdateUserDetailsRequest;
import com.lucky.main.dto.UserResponse;
import com.lucky.main.entity.User;
import com.lucky.main.enums.Role;
import com.lucky.main.exception.UserNotFoundException;
import com.lucky.main.mapper.UserMapper;
import com.lucky.main.repository.UserRepository;
import com.lucky.main.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findByRolesContaining(Role.USER, pageable)
                .map(UserMapper::toResponse);
    }

    @Override
    public UserResponse addUser(RegisterRequest request) throws UserNotFoundException {

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .password(passwordEncoder.encode(request.getPassword()))
                .address(request.getAddress())
                .enabled(true)
                .roles(Set.of(Role.USER))
                .build();

        User savedUser = userRepository.save(user);


        if (ObjectUtils.isEmpty(savedUser)) {
            throw new UserNotFoundException("Failed to Create New User");
        } else {
            return UserResponse.builder()
                    .id(savedUser.getId())
                    .name(savedUser.getFirstName() + " " + savedUser.getLastName())
                    .email(savedUser.getEmail())
                    .phoneNumber(savedUser.getPhoneNumber())
                    .createAt(savedUser.getCreatedAt())
                    .updateAt(savedUser.getUpdatedAt())
                    .isEnabled(savedUser.isEnabled())
                    .address(savedUser.getAddress())
                    .roles(savedUser.getRoles())
                    .build();
        }

    }

    @Override
    public void deleteUser(Long id) throws UserNotFoundException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User you want to delete is not Present in DB"));
        userRepository.delete(user);
    }

    @Override
    public User findUser(Long id) throws UserNotFoundException {
        return userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("No User Found with this Id"));
    }

    @Override
    public UserResponse updateUser(Long id, UpdateUserDetailsRequest userDetailsRequest) throws UserNotFoundException {
        User existingUser = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("No User Found"));
        if (ObjectUtils.isEmpty(userDetailsRequest)) {
            throw new UserNotFoundException("Invalid User Details Request");
        }
//System.out.println(existingUser);
        existingUser.setFirstName(userDetailsRequest.getFirstName());
        existingUser.setLastName(userDetailsRequest.getLastName());
        existingUser.setPhoneNumber(userDetailsRequest.getPhoneNumber());

        existingUser.setAddress(userDetailsRequest.getAddress());

        com.lucky.main.entity.User updatedUser = userRepository.save(existingUser);
        return UserMapper.toResponse(updatedUser);
    }

    @Override
    public UserResponse blockUser(Long id) throws UserNotFoundException {
        com.lucky.main.entity.User user = findUser(id);
        user.setEnabled(false);
        userRepository.save(user);
        return UserMapper.toResponse(userRepository.save(user));
    }

    @Override
    public UserResponse unBlockUser(Long id) throws UserNotFoundException {
        com.lucky.main.entity.User user = findUser(id);
        user.setEnabled(true);
        userRepository.save(user);
        return UserMapper.toResponse(userRepository.save(user));
    }

    @Override
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public List<UserResponse> filterUsers(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return userRepository.findAll()
                    .stream()
                    .map((user) -> UserMapper.toResponse(user))
                    .toList();
        }
        return userRepository.searchUsers(keyword.trim())
                .stream()
                .map((user) -> UserMapper.toResponse(user))
                .toList();
    }

    @Override
    public UserResponse changeAccountPassword(
            ChangePasswordRequest request,
            Long userId
    ) throws UserNotFoundException {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));


        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword())) {

            throw new RuntimeException("Current password is incorrect.");
        }


        if (!request.getNewPassword()
                .equals(request.getConfirmPassword())) {

            throw new RuntimeException("New passwords do not match.");
        }

        if (passwordEncoder.matches(
                request.getNewPassword(),
                user.getPassword())) {

            throw new RuntimeException(
                    "New password cannot be the same as the current password."
            );
        }

        user.setPassword(
                passwordEncoder.encode(request.getNewPassword())
        );

        User updatedUser = userRepository.save(user);

        return UserMapper.toResponse(updatedUser);
    }

    @Override
    public Long countPeopleWhichRoleUser(Role role) {
        return userRepository.countUsersByRole(role);
    }
}
