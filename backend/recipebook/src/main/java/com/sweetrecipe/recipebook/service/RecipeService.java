package com.sweetrecipe.recipebook.service;

import com.sweetrecipe.recipebook.dto.request.RecipeCreateRequest;
import com.sweetrecipe.recipebook.dto.request.RecipeUpdateRequest;
import com.sweetrecipe.recipebook.dto.response.RecipeDetailResponse;
import com.sweetrecipe.recipebook.dto.response.RecipeSummaryResponse;
import com.sweetrecipe.recipebook.global.exception.CustomException;
import com.sweetrecipe.recipebook.global.exception.code.RecipeErrorCode;
import com.sweetrecipe.recipebook.mapper.RecipeMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecipeService {

    private final RecipeMapper recipeMapper;

    @Transactional
    public Long createRecipe(RecipeCreateRequest request) {
        recipeMapper.insertRecipe(request);
        Long recipeId = request.getRecipeId();

        if (request.getIngredients() != null && !request.getIngredients().isEmpty()) {
            recipeMapper.insertIngredients(recipeId, request.getIngredients());
        }
        if (request.getSteps() != null && !request.getSteps().isEmpty()) {
            recipeMapper.insertSteps(recipeId, request.getSteps());
        }
        return recipeId;
    }

    @Transactional(readOnly = true)
    public List<RecipeSummaryResponse> getRecipesByUser(Long userId) {
        return recipeMapper.findAllByUserId(userId);
    }

    @Transactional(readOnly = true)
    public RecipeDetailResponse getRecipeDetail(Long recipeId) {
        RecipeDetailResponse detail = recipeMapper.findDetailById(recipeId);
        if (detail == null) {
            throw new CustomException(RecipeErrorCode.RECIPE_NOT_FOUND);
        }
        return detail;
    }

    @Transactional
    public void updateRecipe(Long recipeId, RecipeUpdateRequest request) {
        RecipeDetailResponse existing = recipeMapper.findDetailById(recipeId);
        if (existing == null) {
            throw new CustomException(RecipeErrorCode.RECIPE_NOT_FOUND);
        }

        recipeMapper.updateRecipe(recipeId, request);

        recipeMapper.deleteIngredients(recipeId);
        if (request.getIngredients() != null && !request.getIngredients().isEmpty()) {
            recipeMapper.insertIngredients(recipeId, request.getIngredients());
        }

        recipeMapper.deleteSteps(recipeId);
        if (request.getSteps() != null && !request.getSteps().isEmpty()) {
            recipeMapper.insertSteps(recipeId, request.getSteps());
        }
    }

    @Transactional
    public void deleteRecipe(Long recipeId) {
        RecipeDetailResponse existing = recipeMapper.findDetailById(recipeId);
        if (existing == null) {
            throw new CustomException(RecipeErrorCode.RECIPE_NOT_FOUND);
        }
        recipeMapper.deleteRecipe(recipeId);
    }
}
