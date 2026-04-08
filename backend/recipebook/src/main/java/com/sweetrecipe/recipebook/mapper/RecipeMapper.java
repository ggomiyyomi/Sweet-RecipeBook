package com.sweetrecipe.recipebook.mapper;

import com.sweetrecipe.recipebook.dto.request.IngredientRequest;
import com.sweetrecipe.recipebook.dto.request.RecipeCreateRequest;
import com.sweetrecipe.recipebook.dto.request.RecipeStepRequest;
import com.sweetrecipe.recipebook.dto.response.RecipeDetailResponse;
import com.sweetrecipe.recipebook.dto.response.RecipeSummaryResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface RecipeMapper {

    void insertRecipe(RecipeCreateRequest request);

    void insertIngredients(@Param("recipeId") Long recipeId,
                           @Param("ingredients") List<IngredientRequest> ingredients);

    void insertSteps(@Param("recipeId") Long recipeId,
                     @Param("steps") List<RecipeStepRequest> steps);

    List<RecipeSummaryResponse> findAllByUserId(@Param("userId") Long userId);

    RecipeDetailResponse findDetailById(@Param("recipeId") Long recipeId);
}
