package com.ayur.admin.service.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefundRequest {

  @NotNull(message = "Refund amount is required")
  @DecimalMin(value = "0.01", message = "Refund amount must be greater than 0")
  private BigDecimal amount;

  @NotBlank(message = "Reason is required")
  private String reason;

  private Boolean restockItems;
}
