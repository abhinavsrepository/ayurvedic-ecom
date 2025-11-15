package com.ayur.admin.service.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatusUpdateRequest {

  @NotBlank(message = "Status is required")
  private String status;

  private String paymentStatus;
  private String fulfillmentStatus;
  private String trackingNumber;
  private String carrier;
  private String notes;
}
