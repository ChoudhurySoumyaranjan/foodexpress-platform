package com.lucky.main.exception;

import com.lucky.main.repository.UserRepository;

public class UserNotFoundException extends Exception {
    public UserNotFoundException(String message) {
        super(message);
    }
}
