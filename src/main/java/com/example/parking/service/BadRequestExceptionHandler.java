package com.example.parking.service;


import org.apache.coyote.BadRequestException;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.Map;


@RestControllerAdvice
public class BadRequestExceptionHandler {

    private Map<String,Object> base(int status, String message){
        var m = new LinkedHashMap<String,Object>();
        m.put("timestamp", Instant.now().toString());
        m.put("status", status);
        m.put("message", message);
        return m;
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<?> br(BadRequestException ex){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(base(400, ex.getMessage()));
    }

    @ExceptionHandler(ChangeSetPersister.NotFoundException.class)
    public ResponseEntity<?> nf(ChangeSetPersister.NotFoundException ex){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(base(404, ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> validation(MethodArgumentNotValidException ex){
        var body = base(400, "Validation failed");
        var errors = new ArrayList<Map<String,String>>();
        for (var e : ex.getBindingResult().getAllErrors()) {
            var fe = (FieldError)e;
            errors.add(Map.of("field", fe.getField(), "message", fe.getDefaultMessage()));
        }
        body.put("errors", errors);
        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<?> unreadable(HttpMessageNotReadableException ex){
        return ResponseEntity.badRequest().body(base(400, "Malformed JSON or invalid date format"));
    }
}