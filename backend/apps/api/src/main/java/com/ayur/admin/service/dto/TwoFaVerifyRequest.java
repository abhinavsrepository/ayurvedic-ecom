package com.ayur.admin.service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TwoFaVerifyRequest {

  @NotBlank(message = "2FA code is required")
  @Pattern(regexp = "\\d{6}", message = "2FA code must be 6 digits")
  private String code;
}
