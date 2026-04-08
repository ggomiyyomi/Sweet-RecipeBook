package com.sweetrecipe.recipebook.mapper;

import com.sweetrecipe.recipebook.dto.request.BookCreateRequest;
import com.sweetrecipe.recipebook.dto.request.BookItemRequest;
import com.sweetrecipe.recipebook.dto.request.BookUpdateRequest;
import com.sweetrecipe.recipebook.dto.response.BookDetailResponse;
import com.sweetrecipe.recipebook.dto.response.BookSummaryResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BookMapper {

    void insertBook(BookCreateRequest request);

    void insertBookItems(@Param("recipeBookId") Long recipeBookId,
                         @Param("items") List<BookItemRequest> items);

    List<BookSummaryResponse> findAllByUserId(@Param("userId") Long userId);

    BookDetailResponse findDetailById(@Param("recipeBookId") Long recipeBookId);

    void updateBookTitle(@Param("recipeBookId") Long recipeBookId,
                         @Param("title") String title);

    void deleteBookItems(@Param("recipeBookId") Long recipeBookId);

    void deleteBook(@Param("recipeBookId") Long recipeBookId);

    void updateBookGenerated(@Param("recipeBookId") Long recipeBookId,
                             @Param("externalBookId") String externalBookId);

    void updateBookStatus(@Param("recipeBookId") Long recipeBookId,
                          @Param("status") String status);
}
