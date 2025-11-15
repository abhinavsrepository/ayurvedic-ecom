package com.ayur.admin.service.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductCreateRequest {

  @NotBlank(message = "SKU is required")
  @Size(max = 100)
  private String sku;

  @NotBlank(message = "Product name is required")
  @Size(max = 500)
  private String name;

  @NotBlank(message = "Slug is required")
  @Size(max = 200)
  @Pattern(
      regexp = "^[a-z0-9-]+$",
      message = "Slug must contain only lowercase letters, numbers, and hyphens")
  private String slug;

  private String description;

  @Size(max = 1000)
  private String shortDescription;

  @NotNull(message = "Price is required")
  @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
  private BigDecimal price;

  @DecimalMin(value = "0.0", message = "Compare at price must be non-negative")
  private BigDecimal compareAtPrice;

  @DecimalMin(value = "0.0", message = "Cost price must be non-negative")
  private BigDecimal costPrice;

  @NotBlank(message = "Status is required")
  private String status;

  private String category;
  private String brand;
  private List<String> tags;
  private List<ProductImageDto> images;
  private Integer weightGrams;
  private Boolean isFeatured;
  private String seoTitle;
  private String seoDescription;

  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class ProductImageDto {
    private String url;
    private String altText;
  }
}
