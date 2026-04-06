package com.sweetrecipe.recipebook.global.exception.code;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum RecipeErrorCode implements BaseErrorCode {

    RECIPE_NOT_FOUND("RECIPE_404", "레시피를 찾을 수 없습니다.", HttpStatus.NOT_FOUND);

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;
}
