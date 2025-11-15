package com.ayur.admin.service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TwoFaEnableResponse {
  private String secret;
  private String qrCodeUrl;
}
