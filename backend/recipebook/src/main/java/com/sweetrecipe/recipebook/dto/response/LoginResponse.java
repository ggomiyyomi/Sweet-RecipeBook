package com.sweetrecipe.recipebook.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {
    private String accessToken;
    private Long userId;
    private String name;
    private String email;
}
