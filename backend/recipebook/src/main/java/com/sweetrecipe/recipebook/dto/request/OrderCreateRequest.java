package com.sweetrecipe.recipebook.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class OrderCreateRequest {
    private Long orderId;          // MyBatis useGeneratedKeys로 채워짐
    private Long userId;
    private Long recipeBookId;
    private Integer quantity;
    private String recipientName;
    private String recipientPhone;
    private String postalCode;
    private String address;
    private String addressDetail;
}
