package com.lucky.main.exception.contactus;

public class ContactUsException extends RuntimeException {
    public ContactUsException(String message) {
        super(message);
    }
    public ContactUsException() {
        super();
    }
}
