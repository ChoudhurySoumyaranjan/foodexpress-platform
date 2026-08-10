package com.lucky.main.exception.food;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

public class FoodNotFoundException extends FoodException {

    public FoodNotFoundException(Long id) {
        super("Food not found with id: " + id);
    }
    public FoodNotFoundException(String message) {
        super(message);
    }
}