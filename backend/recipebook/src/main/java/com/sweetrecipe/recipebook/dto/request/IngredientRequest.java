package com.sweetrecipe.recipebook.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@NoArgsConstructor
public class IngredientRequest {
    private String name;
    private BigDecimal amount;
    private String unit;
    private Integer sortOrder;
}
