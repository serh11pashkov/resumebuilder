package com.example.demo.exception;

import java.util.Date;
import java.util.Map;

public class ValidationErrorResponse {
    private Date timestamp;
    private String message;
    private Map<String, String> errors;

    public ValidationErrorResponse(Date timestamp, String message, Map<String, String> errors) {
        this.timestamp = timestamp;
        this.message = message;
        this.errors = errors;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public String getMessage() {
        return message;
    }

    public Map<String, String> getErrors() {
        return errors;
    }
}
