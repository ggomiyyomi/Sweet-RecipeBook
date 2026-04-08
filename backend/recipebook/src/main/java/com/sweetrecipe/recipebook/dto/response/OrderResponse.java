package com.sweetrecipe.recipebook.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class OrderResponse {
    private Long orderId;
    private Long userId;
    private Long recipeBookId;
    private String externalOrderId;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
