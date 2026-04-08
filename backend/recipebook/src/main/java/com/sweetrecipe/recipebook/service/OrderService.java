package com.sweetrecipe.recipebook.service;

import com.sweetrecipe.recipebook.dto.request.OrderCreateRequest;
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
}
