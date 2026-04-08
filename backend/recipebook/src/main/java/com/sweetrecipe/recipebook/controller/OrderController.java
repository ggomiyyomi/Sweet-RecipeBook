package com.sweetrecipe.recipebook.controller;

import com.sweetrecipe.recipebook.dto.request.OrderCreateRequest;
import com.sweetrecipe.recipebook.dto.request.ShippingUpdateRequest;
import com.sweetrecipe.recipebook.dto.response.OrderResponse;
import com.sweetrecipe.recipebook.global.security.UserPrincipal;
import com.sweetrecipe.recipebook.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    public ResponseEntity<Void> createOrder(@RequestBody OrderCreateRequest request,
                                            @AuthenticationPrincipal UserPrincipal currentUser) {
        request.setUserId(currentUser.getUserId());
        Long orderId = orderService.createOrder(request);
        return ResponseEntity.created(URI.create("/api/orders/" + orderId)).build();
    }

    @Operation(summary = "주문 단건 조회")
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getOrder(orderId));
    }

    @Operation(summary = "내 주문 목록 조회")
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getOrdersByUser(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(orderService.getOrdersByUser(currentUser.getUserId()));
    }

    @Operation(summary = "주문 취소", description = "PAID 또는 PDF_READY 상태인 주문만 취소 가능합니다.")
    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<Void> cancelOrder(@PathVariable Long orderId,
                                            @RequestParam(defaultValue = "고객 요청 취소") String cancelReason) {
        orderService.cancelOrder(orderId, cancelReason);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "배송지 수정", description = "출고 전 주문의 배송지를 수정합니다.")
    @PatchMapping("/{orderId}/shipping")
    public ResponseEntity<Void> updateShipping(@PathVariable Long orderId,
                                               @RequestBody ShippingUpdateRequest request) {
        orderService.updateShipping(orderId, request);
        return ResponseEntity.noContent().build();
    }
}
