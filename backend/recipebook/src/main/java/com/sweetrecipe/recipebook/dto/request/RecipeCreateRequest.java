package com.sweetrecipe.recipebook.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class RecipeCreateRequest {
    private Long recipeId;  // MyBatis useGeneratedKeys로 채워짐
    private Long userId;
    private String title;
    private String thumbnailUrl;
    private Integer cookingTime;
    private String review;
    private String memo;
    private List<IngredientRequest> ingredients;
    private List<RecipeStepRequest> steps;
}
