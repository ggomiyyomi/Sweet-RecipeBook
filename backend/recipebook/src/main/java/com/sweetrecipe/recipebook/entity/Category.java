package com.sweetrecipe.recipebook.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class Category {
    private Long categoryId;
    private Long userId;
    private String name;
    private Integer sortOrder;
}
