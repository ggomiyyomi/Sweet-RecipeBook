package com.sweetrecipe.recipebook.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class RecipeSummaryResponse {
    private Long recipeId;
    private String title;
    private String thumbnailUrl;
    private Integer cookingTime;
    private LocalDateTime createdAt;
}
