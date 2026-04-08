package com.sweetrecipe.recipebook.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class RecipeStep {
    private Long stepId;
    private Long recipeId;
    private String stepType;   // FOOD | SAUCE
    private Integer stepOrder;
    private String description;
    private String imageUrl;
}
