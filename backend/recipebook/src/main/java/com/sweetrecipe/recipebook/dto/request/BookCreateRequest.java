package com.sweetrecipe.recipebook.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Getter
@NoArgsConstructor
public class BookCreateRequest {
    private Long recipeBookId;        // MyBatis useGeneratedKeys로 채워짐
    private Long userId;
    private String title;
    private String bookSpecUid;        // 판형 UID (GET /api/books/specs 로 조회)
    private String coverTemplateUid;   // 표지 템플릿 UID (GET /api/books/templates 로 조회)
    private Map<String, Object> coverParams;   // 표지 템플릿 파라미터 (템플릿별로 다름)
    private String contentTemplateUid; // 내지 템플릿 UID
    private List<BookItemRequest> items;
}
