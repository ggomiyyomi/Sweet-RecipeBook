package com.sweetrecipe.recipebook.global.exception;

import com.sweetrecipe.recipebook.global.exception.code.BaseErrorCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ErrorResponse> handleCustomException(CustomException ex) {
        BaseErrorCode errorCode = ex.getErrorCode();
        return ResponseEntity
                .status(errorCode.getHttpStatus())
                .body(new ErrorResponse(errorCode.getCode(), errorCode.getMessage()));
    }
}
