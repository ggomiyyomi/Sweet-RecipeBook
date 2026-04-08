package com.sweetrecipe.recipebook.dto.request;

import lombok.Getter;

@Getter
public class ShippingUpdateRequest {
    private String recipientName;
    private String recipientPhone;
    private String postalCode;
    private String address;
    private String addressDetail;
    private String memo;
}
