package com.sweetrecipe.recipebook.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CategoryResponse {
    private Long categoryId;
    private Long userId;
    private String name;
    private Integer sortOrder;
}
