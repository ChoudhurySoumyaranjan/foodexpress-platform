package com.lucky.main.exception.food;

public class FoodAlreadyExistsException extends FoodException {

    public FoodAlreadyExistsException(String name) {
        super("Food already exists with name: " + name);
    }
}
