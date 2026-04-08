package com.sweetrecipe.recipebook.global.client;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sweetrecipe.recipebook.dto.response.RecipeDetailResponse;
import com.sweetrecipe.recipebook.global.client.dto.ExternalBookCreatedData;
import com.sweetrecipe.recipebook.global.client.dto.ExternalBookFinalizedData;
import com.sweetrecipe.recipebook.global.client.dto.ExternalOrderCreatedData;
import com.sweetrecipe.recipebook.global.client.dto.SweetBookApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class SweetBookApiClient {

    private final RestClient sweetBookRestClient;
    private final ObjectMapper objectMapper;

    /** 1. 책 생성 → bookUid 반환 */
    public String createBook(String title, String bookSpecUid) {
        Map<String, String> body = new HashMap<>();
        body.put("title", title);
        body.put("bookSpecUid", bookSpecUid);

        SweetBookApiResponse<ExternalBookCreatedData> response = sweetBookRestClient.post()
                .uri("/books")
                .header("Idempotency-Key", UUID.randomUUID().toString())
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});

        if (response == null || !response.isSuccess()) {
            throw new RuntimeException("SweetBook 책 생성 실패: " +
                    (response != null ? response.getMessage() : "응답 없음"));
        }
        return response.getData().getBookUid();
    }

    /** 2. 표지 추가 (multipart/form-data) */
    public void addCover(String bookUid, String coverTemplateUid, Map<String, Object> params) {
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("templateUid", coverTemplateUid);
        body.add("parameters", toJson(params));

        SweetBookApiResponse<?> response = sweetBookRestClient.post()
                .uri("/books/{bookUid}/cover", bookUid)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(body)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});

        if (response == null || !response.isSuccess()) {
            throw new RuntimeException("SweetBook 표지 추가 실패: " +
                    (response != null ? response.getMessage() : "응답 없음"));
        }
    }

    /** 3. 레시피 내지 추가 (multipart/form-data) */
    public void addRecipeContent(String bookUid, String contentTemplateUid,
                                 RecipeDetailResponse recipe) {
        Map<String, Object> params = buildRecipeParameters(recipe);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("templateUid", contentTemplateUid);
        body.add("parameters", toJson(params));

        SweetBookApiResponse<?> response = sweetBookRestClient.post()
                .uri("/books/{bookUid}/contents", bookUid)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(body)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});

        if (response == null || !response.isSuccess()) {
            throw new RuntimeException("SweetBook 내지 추가 실패 (recipe: " + recipe.getRecipeId() + "): " +
                    (response != null ? response.getMessage() : "응답 없음"));
        }
    }

    /** 4. 책 최종화 */
    public void finalizeBook(String bookUid) {
        SweetBookApiResponse<ExternalBookFinalizedData> response = sweetBookRestClient.post()
                .uri("/books/{bookUid}/finalization", bookUid)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of())
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});

        if (response == null || !response.isSuccess()) {
            throw new RuntimeException("SweetBook 최종화 실패: " +
                    (response != null ? response.getMessage() : "응답 없음"));
        }
        log.info("SweetBook 책 최종화 완료: bookUid={}, pageCount={}",
                bookUid, response.getData() != null ? response.getData().getPageCount() : "?");
    }

    /** 5. 주문 생성 */
    public String createOrder(String bookUid, int quantity,
                              String recipientName, String recipientPhone,
                              String postalCode, String address, String addressDetail) {
        Map<String, Object> item = new HashMap<>();
        item.put("bookUid", bookUid);
        item.put("quantity", quantity);

        Map<String, Object> shipping = new HashMap<>();
        shipping.put("recipientName", recipientName);
        shipping.put("recipientPhone", recipientPhone);
        shipping.put("postalCode", postalCode);
        shipping.put("address1", address);
        if (addressDetail != null) shipping.put("addressDetail", addressDetail);

        Map<String, Object> body = new HashMap<>();
        body.put("items", List.of(item));
        body.put("shipping", shipping);

        SweetBookApiResponse<ExternalOrderCreatedData> response = sweetBookRestClient.post()
                .uri("/orders")
                .header("Idempotency-Key", UUID.randomUUID().toString())
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});

        if (response == null || !response.isSuccess()) {
            throw new RuntimeException("SweetBook 주문 생성 실패: " +
                    (response != null ? response.getMessage() : "응답 없음"));
        }
        log.info("SweetBook 주문 생성 완료: bookUid={}, orderUid={}", bookUid, response.getData().getOrderUid());
        return response.getData().getOrderUid();
    }

    /** 6. 주문 취소 */
    public void cancelOrder(String orderUid, String cancelReason) {
        SweetBookApiResponse<?> response = sweetBookRestClient.post()
                .uri("/orders/{orderUid}/cancel", orderUid)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("cancelReason", cancelReason))
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});

        if (response == null || !response.isSuccess()) {
            throw new RuntimeException("SweetBook 주문 취소 실패: " +
                    (response != null ? response.getMessage() : "응답 없음"));
        }
        log.info("SweetBook 주문 취소 완료: orderUid={}", orderUid);
    }

    /** 7. 배송지 수정 */
    public void updateShipping(String orderUid, String recipientName, String recipientPhone,
                               String postalCode, String address, String addressDetail, String memo) {
        Map<String, Object> body = new HashMap<>();
        body.put("recipientName", recipientName);
        body.put("recipientPhone", recipientPhone);
        body.put("postalCode", postalCode);
        body.put("address1", address);
        if (addressDetail != null) body.put("addressDetail", addressDetail);
        if (memo != null) body.put("memo", memo);

        SweetBookApiResponse<?> response = sweetBookRestClient.patch()
                .uri("/orders/{orderUid}/shipping", orderUid)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});

        if (response == null || !response.isSuccess()) {
            throw new RuntimeException("SweetBook 배송지 수정 실패: " +
                    (response != null ? response.getMessage() : "응답 없음"));
        }
        log.info("SweetBook 배송지 수정 완료: orderUid={}", orderUid);
    }

    private Map<String, Object> buildRecipeParameters(RecipeDetailResponse recipe) {
        Map<String, Object> params = new HashMap<>();

        // 일기장B 내지 템플릿 필드
        params.put("title", recipe.getTitle());
        params.put("date", LocalDate.now().toString());

        StringBuilder body = new StringBuilder();
        if (recipe.getCookingTime() != null) {
            body.append("조리 시간: ").append(recipe.getCookingTime()).append("분\n\n");
        }
        if (recipe.getIngredients() != null && !recipe.getIngredients().isEmpty()) {
            body.append("[재료]\n");
            recipe.getIngredients().forEach(i ->
                    body.append(i.getName()).append(" ")
                            .append(i.getAmount() != null ? i.getAmount() : "").append(" ")
                            .append(nullToEmpty(i.getUnit())).append("\n"));
            body.append("\n");
        }
        if (recipe.getSteps() != null && !recipe.getSteps().isEmpty()) {
            body.append("[조리 순서]\n");
            recipe.getSteps().stream()
                    .filter(s -> "FOOD".equals(s.getStepType()))
                    .forEach(s -> body.append(s.getStepOrder()).append(". ").append(s.getDescription()).append("\n"));
            recipe.getSteps().stream()
                    .filter(s -> "SAUCE".equals(s.getStepType()))
                    .forEach(s -> body.append(s.getStepOrder()).append(". ").append(s.getDescription()).append("\n"));
        }
        if (recipe.getMemo() != null) {
            body.append("\n[메모] ").append(recipe.getMemo());
        }
        params.put("diaryText", body.toString());

        if (recipe.getThumbnailUrl() != null) {
            params.put("photo1", recipe.getThumbnailUrl());  // 58edh76I0rYa: 좌측 전체 사진
        }

        return params;
    }

    private String toJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("JSON 직렬화 실패", e);
        }
    }

    private String nullToEmpty(String s) {
        return s != null ? s : "";
    }
}
