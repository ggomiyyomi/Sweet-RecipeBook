package com.sweetrecipe.recipebook.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
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
