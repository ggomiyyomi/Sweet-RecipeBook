package com.sweetrecipe.recipebook.service;

import com.sweetrecipe.recipebook.dto.request.CategoryCreateRequest;
import com.sweetrecipe.recipebook.dto.request.CategoryUpdateRequest;
import com.sweetrecipe.recipebook.dto.response.CategoryResponse;
import com.sweetrecipe.recipebook.global.exception.CustomException;
import com.sweetrecipe.recipebook.global.exception.code.CategoryErrorCode;
import com.sweetrecipe.recipebook.mapper.CategoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryMapper categoryMapper;

    @Transactional
    public CategoryResponse createCategory(CategoryCreateRequest request) {
        categoryMapper.insertCategory(request);
        return categoryMapper.findById(request.getCategoryId());
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getCategoriesByUser(Long userId) {
        return categoryMapper.findAllByUserId(userId);
    }

    @Transactional
    public CategoryResponse updateCategory(Long categoryId, CategoryUpdateRequest request) {
        CategoryResponse existing = categoryMapper.findById(categoryId);
        if (existing == null) {
            throw new CustomException(CategoryErrorCode.CATEGORY_NOT_FOUND);
        }
        categoryMapper.updateCategory(categoryId, request);
        return categoryMapper.findById(categoryId);
    }

    @Transactional
    public void deleteCategory(Long categoryId) {
        CategoryResponse existing = categoryMapper.findById(categoryId);
        if (existing == null) {
            throw new CustomException(CategoryErrorCode.CATEGORY_NOT_FOUND);
        }
        categoryMapper.deleteCategory(categoryId);
    }
}
