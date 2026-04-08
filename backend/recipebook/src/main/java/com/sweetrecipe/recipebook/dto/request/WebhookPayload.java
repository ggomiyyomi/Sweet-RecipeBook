package com.sweetrecipe.recipebook.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class WebhookPayload {

    @JsonProperty("event_uid")
    private String eventUid;

    @JsonProperty("event_type")
    private String eventType;

    @JsonProperty("test")
    private boolean test;

    @JsonProperty("created_at")
    private String createdAt;

    private OrderData data;

    @Getter
    @Setter
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class OrderData {
        @JsonProperty("order_uid")
        private String orderUid;

        private Integer status;

        private String message;
    }
}
