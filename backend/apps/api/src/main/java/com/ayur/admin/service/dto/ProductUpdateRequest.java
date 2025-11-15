package com.ayur.admin.service.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
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
public class ProductUpdateRequest {

  @Size(max = 500)
  private String name;

  private String description;

  @Size(max = 1000)
  private String shortDescription;

  @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
  private BigDecimal price;

  @DecimalMin(value = "0.0")
  private BigDecimal compareAtPrice;

  @DecimalMin(value = "0.0")
  private BigDecimal costPrice;

  private String status;
  private String category;
  private String brand;
  private List<String> tags;
  private List<ProductCreateRequest.ProductImageDto> images;
  private Integer weightGrams;
  private Boolean isFeatured;
  private String seoTitle;
  private String seoDescription;
}
