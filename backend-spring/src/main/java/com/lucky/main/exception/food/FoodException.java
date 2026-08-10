package com.lucky.main.exception.food;

public class FoodException extends RuntimeException {

    public FoodException(String message) {
        super(message);
    }

    public FoodException(String message, Throwable cause) {
        super(message, cause);
    }
}
