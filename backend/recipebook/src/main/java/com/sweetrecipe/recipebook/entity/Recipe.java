package com.sweetrecipe.recipebook.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@NoArgsConstructor
public class Recipe {
    private Long recipeId;
    private Long userId;
    private String title;
    private String thumbnailUrl;
    private Integer cookingTime;
    private String review;
    private String memo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<Ingredient> ingredients;
    private List<RecipeStep> steps;
}
