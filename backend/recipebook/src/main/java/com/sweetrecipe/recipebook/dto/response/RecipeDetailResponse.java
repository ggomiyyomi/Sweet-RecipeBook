package com.sweetrecipe.recipebook.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@NoArgsConstructor
public class RecipeDetailResponse {
    private Long recipeId;
    private Long userId;
    private String title;
    private String thumbnailUrl;
    private Integer cookingTime;
    private String review;
    private String memo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<IngredientResponse> ingredients;
    private List<RecipeStepResponse> steps;
}
