package com.sweetrecipe.recipebook.global.exception.code;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum CommonErrorCode implements BaseErrorCode {

    INTERNAL_SERVER_ERROR("COMMON_500", "서버 내부 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_REQUEST("COMMON_400", "잘못된 요청입니다.", HttpStatus.BAD_REQUEST),
    RESOURCE_NOT_FOUND("COMMON_404", "요청하신 리소스를 찾을 수 없습니다.", HttpStatus.NOT_FOUND);

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;
}
