package com.sweetrecipe.recipebook.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@NoArgsConstructor
public class IngredientResponse {
    private Long ingredientId;
    private String name;
    private BigDecimal amount;
    private String unit;
    private Integer sortOrder;
}
