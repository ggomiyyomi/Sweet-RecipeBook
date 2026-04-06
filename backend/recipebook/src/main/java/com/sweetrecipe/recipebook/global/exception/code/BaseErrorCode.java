package com.sweetrecipe.recipebook.global.exception.code;

import org.springframework.http.HttpStatus;

public interface BaseErrorCode {
    String getCode();
    String getMessage();
    HttpStatus getHttpStatus();
}
