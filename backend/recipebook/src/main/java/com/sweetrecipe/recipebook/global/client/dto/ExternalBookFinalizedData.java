package com.sweetrecipe.recipebook.global.client.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ExternalBookFinalizedData {
    private String result;
    private Integer pageCount;
    private String finalizedAt;
}
