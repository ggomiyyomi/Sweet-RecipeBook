package com.sweetrecipe.recipebook.global.client.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class SweetBookApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private List<String> errors;
}
