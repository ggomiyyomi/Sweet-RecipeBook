package com.sweetrecipe.recipebook.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class User {
    private Long userId;
    private String email;
    private String password;
    private String name;
    private LocalDateTime createdAt;
}
