package com.sweetrecipe.recipebook.controller;

import com.sweetrecipe.recipebook.dto.request.BookCreateRequest;
import com.sweetrecipe.recipebook.dto.request.BookUpdateRequest;
import com.sweetrecipe.recipebook.dto.response.BookDetailResponse;
import com.sweetrecipe.recipebook.dto.response.BookSummaryResponse;
import com.sweetrecipe.recipebook.global.client.SweetBookApiClient;
import com.sweetrecipe.recipebook.service.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;

import java.net.URI;
import java.util.List;

@Tag(name = "Book", description = "레시피 책 API")
@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;
    private final RestClient sweetBookRestClient;

    @Operation(summary = "책 생성 (SweetBook API 연동)")
    @PostMapping
    public ResponseEntity<Void> createBook(@RequestBody BookCreateRequest request) {
        Long recipeBookId = bookService.createBook(request);
        return ResponseEntity.created(URI.create("/api/books/" + recipeBookId)).build();
    }

    @Operation(summary = "유저별 책 목록 조회")
    @GetMapping
    public ResponseEntity<List<BookSummaryResponse>> getBooks(@RequestParam Long userId) {
        return ResponseEntity.ok(bookService.getBooksByUser(userId));
    }

    @Operation(summary = "책 상세 조회")
    @GetMapping("/{recipeBookId}")
    public ResponseEntity<BookDetailResponse> getBookDetail(@PathVariable Long recipeBookId) {
        return ResponseEntity.ok(bookService.getBookDetail(recipeBookId));
    }

    @Operation(summary = "책 내용 수정")
    @PutMapping("/{recipeBookId}")
    public ResponseEntity<Void> updateBook(@PathVariable Long recipeBookId,
                                           @RequestBody BookUpdateRequest request) {
        bookService.updateBook(recipeBookId, request);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "책 삭제")
    @DeleteMapping("/{recipeBookId}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long recipeBookId) {
        bookService.deleteBook(recipeBookId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "판형 목록 조회 (SweetBook)")
    @GetMapping("/specs")
    public ResponseEntity<Object> getBookSpecs() {
        Object response = sweetBookRestClient.get()
                .uri("/book-specs")
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "템플릿 상세 조회 (SweetBook)")
    @GetMapping("/templates/{templateUid}")
    public ResponseEntity<Object> getTemplateDetail(@PathVariable String templateUid) {
        Object response = sweetBookRestClient.get()
                .uri("/templates/{templateUid}", templateUid)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "템플릿 목록 조회 (SweetBook)")
    @GetMapping("/templates")
    public ResponseEntity<Object> getTemplates(
            @RequestParam(required = false) String bookSpecUid,
            @RequestParam(required = false) String templateKind) {
        Object response = sweetBookRestClient.get()
                .uri(uriBuilder -> {
                    var builder = uriBuilder.path("/templates");
                    if (bookSpecUid != null) builder.queryParam("bookSpecUid", bookSpecUid);
                    if (templateKind != null) builder.queryParam("templateKind", templateKind);
                    return builder.build();
                })
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});
        return ResponseEntity.ok(response);
    }
}
