package com.sweetrecipe.recipebook.controller;

import com.sweetrecipe.recipebook.dto.request.RecipeCreateRequest;
import com.sweetrecipe.recipebook.dto.request.RecipeUpdateRequest;
import com.sweetrecipe.recipebook.dto.response.RecipeDetailResponse;
import com.sweetrecipe.recipebook.dto.response.RecipeSummaryResponse;
import com.sweetrecipe.recipebook.global.security.UserPrincipal;
import com.sweetrecipe.recipebook.service.RecipeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@Tag(name = "Recipe", description = "레시피 API")
@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
public class RecipeController {

    private final RecipeService recipeService;

    @Operation(summary = "레시피 등록")
    @PostMapping
    public ResponseEntity<Void> createRecipe(@RequestBody RecipeCreateRequest request,
                                             @AuthenticationPrincipal UserPrincipal currentUser) {
        request.setUserId(currentUser.getUserId());
        Long recipeId = recipeService.createRecipe(request);
        return ResponseEntity.created(URI.create("/api/recipes/" + recipeId)).build();
    }

    @Operation(summary = "내 레시피 목록 조회")
    @GetMapping
    public ResponseEntity<List<RecipeSummaryResponse>> getRecipes(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(recipeService.getRecipesByUser(currentUser.getUserId()));
    }

    @Operation(summary = "레시피 상세 조회")
    @GetMapping("/{recipeId}")
    public ResponseEntity<RecipeDetailResponse> getRecipeDetail(@PathVariable Long recipeId) {
        return ResponseEntity.ok(recipeService.getRecipeDetail(recipeId));
    }

    @Operation(summary = "레시피 수정")
    @PutMapping("/{recipeId}")
    public ResponseEntity<Void> updateRecipe(@PathVariable Long recipeId,
                                             @RequestBody RecipeUpdateRequest request) {
        recipeService.updateRecipe(recipeId, request);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "레시피 삭제")
    @DeleteMapping("/{recipeId}")
    public ResponseEntity<Void> deleteRecipe(@PathVariable Long recipeId) {
        recipeService.deleteRecipe(recipeId);
        return ResponseEntity.noContent().build();
    }
}
