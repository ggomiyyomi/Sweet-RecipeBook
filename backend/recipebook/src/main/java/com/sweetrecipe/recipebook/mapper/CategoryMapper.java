package com.sweetrecipe.recipebook.mapper;

import com.sweetrecipe.recipebook.dto.request.CategoryCreateRequest;
import com.sweetrecipe.recipebook.dto.request.CategoryUpdateRequest;
import com.sweetrecipe.recipebook.dto.response.CategoryResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CategoryMapper {

    void insertCategory(CategoryCreateRequest request);

    List<CategoryResponse> findAllByUserId(@Param("userId") Long userId);

    CategoryResponse findById(@Param("categoryId") Long categoryId);

    void updateCategory(@Param("categoryId") Long categoryId,
                        @Param("req") CategoryUpdateRequest request);

    void deleteCategory(@Param("categoryId") Long categoryId);
}
