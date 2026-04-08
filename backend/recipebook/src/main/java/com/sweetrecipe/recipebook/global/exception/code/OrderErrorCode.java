package com.sweetrecipe.recipebook.global.exception.code;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum OrderErrorCode implements BaseErrorCode {

    ORDER_NOT_FOUND("ORDER_404", "주문을 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    BOOK_NOT_GENERATED("ORDER_400", "책이 아직 생성되지 않았습니다. 책 생성 후 주문해주세요.", HttpStatus.BAD_REQUEST);

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;
}
