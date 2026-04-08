package com.sweetrecipe.recipebook.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class BookItemResponse {
    private Long itemId;
    private Long recipeId;
    private String recipeTitle;
    private String thumbnailUrl;
    private String sectionTitle;
    private Integer sortOrder;
}
