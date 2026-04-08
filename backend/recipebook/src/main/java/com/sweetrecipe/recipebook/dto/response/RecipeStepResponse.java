package com.sweetrecipe.recipebook.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class RecipeStepResponse {
    private Long stepId;
    private String stepType;
    private Integer stepOrder;
    private String description;
    private String imageUrl;
}
