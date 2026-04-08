package com.sweetrecipe.recipebook.global.security;

import lombok.Getter;
import org.springframework.security.core.userdetails.User;

import java.util.Collections;

@Getter
public class UserPrincipal extends User {

    private final Long userId;

    public UserPrincipal(Long userId, String email, String password) {
        super(email, password, Collections.emptyList());
        this.userId = userId;
    }
}
