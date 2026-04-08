package com.sweetrecipe.recipebook.dto.request;

import lombok.Getter;

import java.util.List;

@Getter
public class RecipeUpdateRequest {
    private String title;
    private String thumbnailUrl;
    private Integer cookingTime;
    private String review;
    private String memo;
    private List<IngredientRequest> ingredients;
    private List<RecipeStepRequest> steps;
}
