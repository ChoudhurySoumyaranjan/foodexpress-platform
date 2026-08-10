package com.lucky.main.exception;

import com.lucky.main.exception.food.FoodException;

public class InvalidFoodException extends FoodException {

    public InvalidFoodException(String message) {
        super(message);
    }
}