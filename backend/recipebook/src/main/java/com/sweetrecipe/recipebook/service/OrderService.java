package com.sweetrecipe.recipebook.service;

import com.sweetrecipe.recipebook.dto.request.OrderCreateRequest;
import com.sweetrecipe.recipebook.dto.request.ShippingUpdateRequest;
import com.sweetrecipe.recipebook.dto.response.BookDetailResponse;
import com.sweetrecipe.recipebook.dto.response.OrderResponse;
import com.sweetrecipe.recipebook.global.client.SweetBookApiClient;
import com.sweetrecipe.recipebook.global.exception.CustomException;
import com.sweetrecipe.recipebook.global.exception.code.BookErrorCode;
import com.sweetrecipe.recipebook.global.exception.code.OrderErrorCode;
import com.sweetrecipe.recipebook.mapper.BookMapper;
import com.sweetrecipe.recipebook.mapper.OrderMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderMapper orderMapper;
    private final BookMapper bookMapper;
    private final SweetBookApiClient sweetBookApiClient;

    @Transactional
    public Long createOrder(OrderCreateRequest request) {
        // 1. 책 존재 여부 및 GENERATED 상태 확인
        BookDetailResponse book = bookMapper.findDetailById(request.getRecipeBookId());
        if (book == null) {
            throw new CustomException(BookErrorCode.BOOK_NOT_FOUND);
        }
        if (!"GENERATED".equals(book.getStatus())) {
            throw new CustomException(OrderErrorCode.BOOK_NOT_GENERATED);
        }

        // 2. DB에 PENDING 상태로 주문 저장
        orderMapper.insertOrder(request);
        Long orderId = request.getOrderId();

        // 3. SweetBook API 주문 생성
        String orderUid = sweetBookApiClient.createOrder(
                book.getExternalBookId(),
                request.getQuantity() != null ? request.getQuantity() : 1,
                request.getRecipientName(),
                request.getRecipientPhone(),
                request.getPostalCode(),
                request.getAddress(),
                request.getAddressDetail()
        );

        // 4. external_order_id 저장 + status → CONFIRMED
        orderMapper.updateOrderConfirmed(orderId, orderUid);
        bookMapper.updateBookStatus(request.getRecipeBookId(), "ORDERED");

        log.info("주문 완료: orderId={}, orderUid={}", orderId, orderUid);
        return orderId;
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrder(Long orderId) {
        OrderResponse order = orderMapper.findById(orderId);
        if (order == null) {
            throw new CustomException(OrderErrorCode.ORDER_NOT_FOUND);
        }
        return order;
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByUser(Long userId) {
        return orderMapper.findAllByUserId(userId);
    }

    @Transactional
    public void cancelOrder(Long orderId, String cancelReason) {
        OrderResponse order = orderMapper.findById(orderId);
        if (order == null) {
            throw new CustomException(OrderErrorCode.ORDER_NOT_FOUND);
        }

        try {
            sweetBookApiClient.cancelOrder(order.getExternalOrderId(), cancelReason);
        } catch (RuntimeException e) {
            log.error("SweetBook 주문 취소 실패: {}", e.getMessage());
            throw new CustomException(OrderErrorCode.ORDER_CANCEL_FAILED);
        }

        orderMapper.updateOrderStatus(orderId, "CANCELLED");
        bookMapper.updateBookStatus(order.getRecipeBookId(), "GENERATED");
        log.info("주문 취소 완료: orderId={}", orderId);
    }

    @Transactional
    public void updateShipping(Long orderId, ShippingUpdateRequest request) {
        OrderResponse order = orderMapper.findById(orderId);
        if (order == null) {
            throw new CustomException(OrderErrorCode.ORDER_NOT_FOUND);
        }

        try {
            sweetBookApiClient.updateShipping(
                    order.getExternalOrderId(),
                    request.getRecipientName(),
                    request.getRecipientPhone(),
                    request.getPostalCode(),
                    request.getAddress(),
                    request.getAddressDetail(),
                    request.getMemo()
            );
        } catch (RuntimeException e) {
            log.error("SweetBook 배송지 수정 실패: {}", e.getMessage());
            throw new CustomException(OrderErrorCode.ORDER_SHIPPING_UPDATE_FAILED);
        }

        log.info("배송지 수정 완료: orderId={}", orderId);
    }

    @Transactional
    public void handleWebhook(String externalOrderId, String eventType, Integer statusCode) {
        if (externalOrderId == null || statusCode == null) {
            log.info("웹훅 테스트 이벤트 수신: eventType={}", eventType);
            return;
        }

        OrderResponse order = orderMapper.findByExternalOrderId(externalOrderId);
        if (order == null) {
            log.warn("웹훅 수신: 알 수 없는 주문 orderUid={}", externalOrderId);
            return;
        }

        String newStatus = resolveStatus(statusCode);
        orderMapper.updateOrderStatus(order.getOrderId(), newStatus);
        log.info("웹훅 상태 업데이트: orderUid={}, event={}, status={}", externalOrderId, eventType, newStatus);
    }

    private String resolveStatus(int code) {
        return switch (code) {
            case 20 -> "PAID";
            case 25 -> "PDF_READY";
            case 30 -> "CONFIRMED";
            case 40 -> "IN_PRODUCTION";
            case 45 -> "COMPLETED";
            case 50 -> "PRODUCTION_COMPLETE";
            case 60 -> "SHIPPED";
            case 70 -> "DELIVERED";
            case 80 -> "CANCELLED";
            case 81 -> "CANCELLED_REFUND";
            default -> "UNKNOWN";
        };
    }
}
