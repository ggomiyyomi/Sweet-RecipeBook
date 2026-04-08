package com.sweetrecipe.recipebook.controller;

import com.sweetrecipe.recipebook.dto.request.OrderCreateRequest;
import com.sweetrecipe.recipebook.dto.response.OrderResponse;
import com.sweetrecipe.recipebook.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@Tag(name = "Order", description = "주문 API")
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @Operation(summary = "주문 생성", description = "생성된 책(GENERATED 상태)을 인쇄 주문합니다.")
    @PostMapping
    public ResponseEntity<Void> createOrder(@RequestBody OrderCreateRequest request) {
        Long orderId = orderService.createOrder(request);
        return ResponseEntity.created(URI.create("/api/orders/" + orderId)).build();
    }

    @Operation(summary = "주문 단건 조회")
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getOrder(orderId));
    }

    @Operation(summary = "사용자 주문 목록 조회")
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getOrdersByUser(@RequestParam Long userId) {
        return ResponseEntity.ok(orderService.getOrdersByUser(userId));
    }
}
