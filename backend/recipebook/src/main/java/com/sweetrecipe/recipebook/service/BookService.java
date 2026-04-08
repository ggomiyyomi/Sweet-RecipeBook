package com.sweetrecipe.recipebook.service;

import com.sweetrecipe.recipebook.dto.request.BookCreateRequest;
import com.sweetrecipe.recipebook.dto.request.BookUpdateRequest;
import com.sweetrecipe.recipebook.dto.response.BookDetailResponse;
import com.sweetrecipe.recipebook.dto.response.BookSummaryResponse;
import com.sweetrecipe.recipebook.dto.response.RecipeDetailResponse;
import com.sweetrecipe.recipebook.global.client.SweetBookApiClient;
import com.sweetrecipe.recipebook.global.exception.CustomException;
import com.sweetrecipe.recipebook.global.exception.code.BookErrorCode;
import com.sweetrecipe.recipebook.mapper.BookMapper;
import com.sweetrecipe.recipebook.mapper.RecipeMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookService {

    private final BookMapper bookMapper;
    private final RecipeMapper recipeMapper;
    private final SweetBookApiClient sweetBookApiClient;

    @Transactional
    public Long createBook(BookCreateRequest request) {
        // 1. DB 저장 (DRAFT)
        bookMapper.insertBook(request);
        Long recipeBookId = request.getRecipeBookId();

        if (request.getItems() != null && !request.getItems().isEmpty()) {
            bookMapper.insertBookItems(recipeBookId, request.getItems());
        }

        // 2. SweetBook API 연동
        String bookUid = generateExternalBook(request, recipeBookId);

        // 3. external_book_id 저장 + status → GENERATED
        bookMapper.updateBookGenerated(recipeBookId, bookUid);

        return recipeBookId;
    }

    private String generateExternalBook(BookCreateRequest request, Long recipeBookId) {
        // 2-1. 외부 책 생성
        String bookUid = sweetBookApiClient.createBook(request.getTitle(), request.getBookSpecUid());
        log.info("SweetBook 책 생성: recipeBookId={}, bookUid={}", recipeBookId, bookUid);

        // 2-2. 표지 추가
        sweetBookApiClient.addCover(bookUid, request.getCoverTemplateUid(), request.getCoverParams());

        // 2-3. 레시피마다 내지 추가
        if (request.getItems() != null) {
            for (var item : request.getItems()) {
                RecipeDetailResponse recipe = recipeMapper.findDetailById(item.getRecipeId());
                if (recipe != null) {
                    sweetBookApiClient.addRecipeContent(bookUid, request.getContentTemplateUid(), recipe);
                }
            }
        }

        // 2-4. 최종화
        sweetBookApiClient.finalizeBook(bookUid);

        return bookUid;
    }

    @Transactional(readOnly = true)
    public List<BookSummaryResponse> getBooksByUser(Long userId) {
        return bookMapper.findAllByUserId(userId);
    }

    @Transactional(readOnly = true)
    public BookDetailResponse getBookDetail(Long recipeBookId) {
        BookDetailResponse detail = bookMapper.findDetailById(recipeBookId);
        if (detail == null) {
            throw new CustomException(BookErrorCode.BOOK_NOT_FOUND);
        }
        return detail;
    }

    @Transactional
    public void updateBook(Long recipeBookId, BookUpdateRequest request) {
        BookDetailResponse existing = bookMapper.findDetailById(recipeBookId);
        if (existing == null) {
            throw new CustomException(BookErrorCode.BOOK_NOT_FOUND);
        }

        if (request.getTitle() != null) {
            bookMapper.updateBookTitle(recipeBookId, request.getTitle());
        }

        if (request.getItems() != null) {
            bookMapper.deleteBookItems(recipeBookId);
            if (!request.getItems().isEmpty()) {
                bookMapper.insertBookItems(recipeBookId, request.getItems());
            }
        }
    }

    @Transactional
    public void deleteBook(Long recipeBookId) {
        BookDetailResponse existing = bookMapper.findDetailById(recipeBookId);
        if (existing == null) {
            throw new CustomException(BookErrorCode.BOOK_NOT_FOUND);
        }
        bookMapper.deleteBook(recipeBookId);
    }
}
