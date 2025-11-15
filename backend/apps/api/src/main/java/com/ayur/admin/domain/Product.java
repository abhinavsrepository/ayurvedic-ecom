package com.ayur.admin.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.*;
import org.hibernate.envers.Audited;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(
    name = "products",
    indexes = {
      @Index(name = "idx_product_slug", columnList = "slug"),
      @Index(name = "idx_product_sku", columnList = "sku"),
      @Index(name = "idx_product_status", columnList = "status")
    })
@Audited
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(nullable = false, unique = true, length = 100)
  private String sku;

  @Column(nullable = false, length = 500)
  private String name;

  @Column(nullable = false, unique = true, length = 200)
  private String slug;

  @Column(columnDefinition = "TEXT")
  private String description;

  @Column(name = "short_description", length = 1000)
  private String shortDescription;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal price;

  @Column(name = "compare_at_price", precision = 10, scale = 2)
  private BigDecimal compareAtPrice;

  @Column(name = "cost_price", precision = 10, scale = 2)
  private BigDecimal costPrice;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 50)
  private ProductStatus status = ProductStatus.DRAFT;

  @Column(length = 200)
  private String category;

  @Column(length = 200)
  private String brand;

  @ElementCollection
  @CollectionTable(name = "product_tags", joinColumns = @JoinColumn(name = "product_id"))
  @Column(name = "tag")
  @Builder.Default
  private List<String> tags = new ArrayList<>();

  @ElementCollection
  @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
  @OrderColumn(name = "image_order")
  @Builder.Default
  private List<ProductImage> images = new ArrayList<>();

  @Column(name = "weight_grams")
  private Integer weightGrams;

  @Column(name = "is_featured")
  private Boolean isFeatured = false;

  @Column(name = "seo_title", length = 200)
  private String seoTitle;

  @Column(name = "seo_description", length = 500)
  private String seoDescription;

  @Column(name = "deleted_at")
  private Instant deletedAt;

  @CreatedDate
  @Column(nullable = false, updatable = false)
  private Instant createdAt;

  @LastModifiedDate
  @Column(nullable = false)
  private Instant updatedAt;

  @Version private Long version;

  public enum ProductStatus {
    DRAFT,
    ACTIVE,
    ARCHIVED,
    OUT_OF_STOCK
  }

  @Embeddable
  @Getter
  @Setter
  @NoArgsConstructor
  @AllArgsConstructor
  public static class ProductImage {
    @Column(name = "url", length = 1000)
    private String url;

    @Column(name = "alt_text", length = 500)
    private String altText;
  }
}
