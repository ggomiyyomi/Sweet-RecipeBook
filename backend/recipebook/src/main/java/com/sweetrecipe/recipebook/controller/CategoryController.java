package com.sweetrecipe.recipebook.controller;

import com.sweetrecipe.recipebook.dto.request.CategoryCreateRequest;
import com.sweetrecipe.recipebook.dto.request.CategoryUpdateRequest;
import com.sweetrecipe.recipebook.dto.response.CategoryResponse;
import com.sweetrecipe.recipebook.global.security.UserPrincipal;
import com.sweetrecipe.recipebook.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@Tag(name = "Category", description = "카테고리 API")
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @Operation(summary = "카테고리 생성")
    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(
            @RequestBody CategoryCreateRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        request.setUserId(currentUser.getUserId());
        CategoryResponse created = categoryService.createCategory(request);
        return ResponseEntity.created(URI.create("/api/categories/" + created.getCategoryId()))
                .body(created);
    }

    @Operation(summary = "내 카테고리 목록 조회")
    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getCategories(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(categoryService.getCategoriesByUser(currentUser.getUserId()));
    }

    @Operation(summary = "카테고리 수정")
    @PutMapping("/{categoryId}")
    public ResponseEntity<CategoryResponse> updateCategory(
            @PathVariable Long categoryId,
            @RequestBody CategoryUpdateRequest request) {
        return ResponseEntity.ok(categoryService.updateCategory(categoryId, request));
    }

    @Operation(summary = "카테고리 삭제")
    @DeleteMapping("/{categoryId}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long categoryId) {
        categoryService.deleteCategory(categoryId);
        return ResponseEntity.noContent().build();
    }
}
