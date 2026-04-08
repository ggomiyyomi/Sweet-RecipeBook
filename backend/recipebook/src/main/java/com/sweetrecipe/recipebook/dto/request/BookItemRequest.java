package com.sweetrecipe.recipebook.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class BookItemRequest {
    private Long recipeId;
    private String sectionTitle;
    private Integer sortOrder;
}
