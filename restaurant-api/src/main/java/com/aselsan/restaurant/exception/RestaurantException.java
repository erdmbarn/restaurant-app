package com.aselsan.restaurant.exception;

import org.springframework.http.HttpStatus;

public class RestaurantException extends RuntimeException {
    private final HttpStatus status;

    public RestaurantException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() { return status; }

    public static RestaurantException notFound(String message) {
        return new RestaurantException(message, HttpStatus.NOT_FOUND);
    }
    public static RestaurantException badRequest(String message) {
        return new RestaurantException(message, HttpStatus.BAD_REQUEST);
    }
    public static RestaurantException forbidden(String message) {
        return new RestaurantException(message, HttpStatus.FORBIDDEN);
    }
    public static RestaurantException conflict(String message) {
        return new RestaurantException(message, HttpStatus.CONFLICT);
    }
}
