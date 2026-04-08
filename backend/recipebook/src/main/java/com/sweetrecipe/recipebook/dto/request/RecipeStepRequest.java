package com.sweetrecipe.recipebook.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class RecipeStepRequest {
    private String stepType;   // FOOD | SAUCE
    private Integer stepOrder;
    private String description;
    private String imageUrl;
}
