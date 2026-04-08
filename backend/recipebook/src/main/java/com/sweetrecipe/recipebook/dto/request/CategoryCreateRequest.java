package com.sweetrecipe.recipebook.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CategoryCreateRequest {
    private Long categoryId;  // MyBatis useGeneratedKeys로 채워짐
    private Long userId;
    private String name;
    private Integer sortOrder;
}
