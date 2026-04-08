package com.sweetrecipe.recipebook.global.client.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ExternalOrderCreatedData {
    private String orderUid;
    private String status;
}
