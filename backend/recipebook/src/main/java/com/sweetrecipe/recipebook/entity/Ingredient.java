package com.sweetrecipe.recipebook.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@NoArgsConstructor
public class Ingredient {
    private Long ingredientId;
    private Long recipeId;
    private String name;
    private BigDecimal amount;
    private String unit;
    private Integer sortOrder;
}
