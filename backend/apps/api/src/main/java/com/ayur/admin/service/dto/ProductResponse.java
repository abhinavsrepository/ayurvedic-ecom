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
public class ProductResponse {
  private UUID id;
  private String sku;
  private String name;
  private String slug;
  private String description;
  private String shortDescription;
  private BigDecimal price;
  private BigDecimal compareAtPrice;
  private BigDecimal costPrice;
  private String status;
  private String category;
  private String brand;
  private List<String> tags;
  private List<ProductImageDto> images;
  private Integer weightGrams;
  private Boolean isFeatured;
  private String seoTitle;
  private String seoDescription;
  private Integer stockQuantity;
  private Boolean lowStock;
  private Instant createdAt;
  private Instant updatedAt;

  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class ProductImageDto {
    private String url;
    private String altText;
  }
}
