package com.ayur.admin.service.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderListResponse {
  private UUID id;
  private String orderNumber;
  private String customerName;
  private String customerEmail;
  private String status;
  private String paymentStatus;
  private String fulfillmentStatus;
  private BigDecimal total;
  private Integer itemsCount;
  private Instant createdAt;
}
