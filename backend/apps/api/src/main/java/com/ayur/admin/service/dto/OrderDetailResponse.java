package com.ayur.admin.service.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetailResponse {
  private UUID id;
  private String orderNumber;
  private CustomerInfo customer;
  private String status;
  private String paymentStatus;
  private String fulfillmentStatus;
  private List<OrderItemDto> items;
  private BigDecimal subtotal;
  private BigDecimal taxAmount;
  private BigDecimal shippingAmount;
  private BigDecimal discountAmount;
  private BigDecimal total;
  private String couponCode;
  private AddressDto shippingAddress;
  private String trackingNumber;
  private String carrier;
  private String utmSource;
  private String utmMedium;
  private String utmCampaign;
  private String notes;
  private Instant createdAt;
  private Instant updatedAt;

  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class CustomerInfo {
    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
  }

  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class OrderItemDto {
    private UUID id;
    private String sku;
    private String productName;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal lineTotal;
    private BigDecimal discountAmount;
  }

  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class AddressDto {
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String postalCode;
    private String country;
  }
}
