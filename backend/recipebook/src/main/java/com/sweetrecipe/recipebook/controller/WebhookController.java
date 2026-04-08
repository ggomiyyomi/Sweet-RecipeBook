package com.sweetrecipe.recipebook.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sweetrecipe.recipebook.dto.request.WebhookPayload;
import com.sweetrecipe.recipebook.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@Tag(name = "Webhook", description = "SweetBook 웹훅 수신")
@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
public class WebhookController {

    private final OrderService orderService;
    private final ObjectMapper objectMapper;

    @Operation(summary = "SweetBook 주문 상태 웹훅 수신")
    @PostMapping("/orders")
    public ResponseEntity<Void> receiveOrderWebhook(
            @RequestHeader("X-Webhook-Event") String eventType,
            @RequestBody String rawBody) {

        WebhookPayload payload;
        try {
            payload = objectMapper.readValue(rawBody, WebhookPayload.class);
        } catch (Exception e) {
            log.error("웹훅 payload 파싱 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }

        log.info("웹훅 수신: eventType={}, orderUid={}, status={}",
                payload.getEventType(),
                payload.getData() != null ? payload.getData().getOrderUid() : null,
                payload.getData() != null ? payload.getData().getStatus() : null);

        orderService.handleWebhook(
                payload.getData() != null ? payload.getData().getOrderUid() : null,
                payload.getEventType(),
                payload.getData() != null ? payload.getData().getStatus() : null
        );

        return ResponseEntity.ok().build();
    }
}
