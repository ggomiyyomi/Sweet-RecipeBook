package com.sweetrecipe.recipebook.mapper;

import com.sweetrecipe.recipebook.dto.request.OrderCreateRequest;
import com.sweetrecipe.recipebook.dto.response.OrderResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface OrderMapper {
    void insertOrder(OrderCreateRequest request);
    void updateOrderConfirmed(@Param("orderId") Long orderId, @Param("externalOrderId") String externalOrderId);
    OrderResponse findById(@Param("orderId") Long orderId);
    List<OrderResponse> findAllByUserId(@Param("userId") Long userId);
}
