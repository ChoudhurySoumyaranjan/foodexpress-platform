package com.lucky.main.handler;

import com.lucky.main.dto.ErrorResponse;
import com.lucky.main.exception.*;
import com.lucky.main.exception.category.CategoryImageException;
import com.lucky.main.exception.category.CategoryNotFoundException;
import com.lucky.main.exception.contactus.ContactUsException;
import com.lucky.main.exception.food.FoodAlreadyExistsException;
import com.lucky.main.exception.food.FoodImageException;
import com.lucky.main.exception.food.FoodNotFoundException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.NoSuchElementException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private ErrorResponse buildErrorResponse(
            HttpStatus status,
            String message,
            HttpServletRequest request
    ) {
        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(status.value())
                .error(status.getReasonPhrase())
                .message(message)
                .path(request.getRequestURI())
                .build();
    }

    @ExceptionHandler(JwtException.class)
    public ResponseEntity<ErrorResponse> handleJwtException(
            JwtException ex,
            HttpServletRequest request) {

        return new ResponseEntity<>(
                buildErrorResponse(
                        HttpStatus.UNAUTHORIZED,
                        "Invalid or expired JWT token",
                        request
                ),
                HttpStatus.UNAUTHORIZED
        );
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFound(
            UserNotFoundException ex,
            HttpServletRequest request) {

        return new ResponseEntity<>(
                buildErrorResponse(HttpStatus.NOT_FOUND, ex.getMessage(), request),
                HttpStatus.NOT_FOUND
        );
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(
            BadCredentialsException ex,
            HttpServletRequest request) {

        return new ResponseEntity<>(
                buildErrorResponse(HttpStatus.UNAUTHORIZED, "Invalid email or password", request),
                HttpStatus.UNAUTHORIZED
        );
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<ErrorResponse> handleNoSuchElement(
            NoSuchElementException ex,
            HttpServletRequest request) {

        return new ResponseEntity<>(
                buildErrorResponse(HttpStatus.NOT_FOUND, ex.getMessage(), request),
                HttpStatus.NOT_FOUND
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            MethodArgumentNotValidException ex,
            HttpServletRequest request) {

        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .findFirst()
                .orElse("Validation failed");

        return new ResponseEntity<>(
                buildErrorResponse(HttpStatus.BAD_REQUEST, message, request),
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(FoodNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleFoodNotFound(
            FoodNotFoundException ex,
            HttpServletRequest request) {

        return new ResponseEntity<>(
                buildErrorResponse(HttpStatus.NOT_FOUND, ex.getMessage(), request),
                HttpStatus.NOT_FOUND
        );
    }

    @ExceptionHandler(FoodAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleFoodExists(
            FoodAlreadyExistsException ex,
            HttpServletRequest request) {

        return new ResponseEntity<>(
                buildErrorResponse(HttpStatus.CONFLICT, ex.getMessage(), request),
                HttpStatus.CONFLICT
        );
    }

    @ExceptionHandler(InvalidFoodException.class)
    public ResponseEntity<ErrorResponse> handleInvalidFood(
            InvalidFoodException ex,
            HttpServletRequest request) {

        return new ResponseEntity<>(
                buildErrorResponse(HttpStatus.BAD_REQUEST, ex.getMessage(), request),
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(FoodImageException.class)
    public ResponseEntity<ErrorResponse> handleImageError(
            FoodImageException ex,
            HttpServletRequest request) {

        return new ResponseEntity<>(
                buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage(), request),
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    @ExceptionHandler(CategoryNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleCategoryNotFound(
            CategoryNotFoundException ex,
            HttpServletRequest request) {
        return new ResponseEntity<>(
                buildErrorResponse(HttpStatus.NOT_FOUND, ex.getMessage(), request),
                HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(CategoryImageException.class)
    public ResponseEntity<ErrorResponse> handleCategoryImageException(
            CategoryImageException ex,
            HttpServletRequest request){
        return new ResponseEntity<>(
                buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage(), request),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(CloudinaryImageException.class)
    public ResponseEntity<ErrorResponse> handleCloudinaryImageException(
            CloudinaryImageException ex,
            HttpServletRequest request){
        return new ResponseEntity<>(
                buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage(), request),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(ContactUsException.class)
    public ResponseEntity<ErrorResponse> handleContactUsException(
            ContactUsException ex,
            HttpServletRequest request){
        return new ResponseEntity<>(
                buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR,ex.getMessage(), request),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
