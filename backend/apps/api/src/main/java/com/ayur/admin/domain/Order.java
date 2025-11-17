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
    name = "orders",
    indexes = {
      @Index(name = "idx_order_number", columnList = "order_number"),
      @Index(name = "idx_order_status", columnList = "status"),
      @Index(name = "idx_order_created_at", columnList = "created_at"),
      @Index(name = "idx_order_customer", columnList = "customer_id")
    })
@Audited
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(name = "order_number", nullable = false, unique = true, length = 50)
  private String orderNumber;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "customer_id", nullable = false)
  private Customer customer;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 50)
  private OrderStatus status = OrderStatus.PENDING;

  @Enumerated(EnumType.STRING)
  @Column(name = "payment_status", nullable = false, length = 50)
  private PaymentStatus paymentStatus = PaymentStatus.PENDING;

  @Enumerated(EnumType.STRING)
  @Column(name = "fulfillment_status", length = 50)
  private FulfillmentStatus fulfillmentStatus = FulfillmentStatus.UNFULFILLED;

  @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
  @Builder.Default
  private List<OrderItem> items = new ArrayList<>();

  @Column(name = "subtotal", nullable = false, precision = 10, scale = 2)
  private BigDecimal subtotal = BigDecimal.ZERO;

  @Column(name = "tax_amount", precision = 10, scale = 2)
  private BigDecimal taxAmount = BigDecimal.ZERO;

  @Column(name = "shipping_amount", precision = 10, scale = 2)
  private BigDecimal shippingAmount = BigDecimal.ZERO;

  @Column(name = "discount_amount", precision = 10, scale = 2)
  private BigDecimal discountAmount = BigDecimal.ZERO;

  @Column(name = "total", nullable = false, precision = 10, scale = 2)
  private BigDecimal total = BigDecimal.ZERO;

  @Column(name = "coupon_code", length = 50)
  private String couponCode;

  @Embedded
  @AttributeOverrides({
    @AttributeOverride(name = "addressLine1", column = @Column(name = "shipping_address_line1")),
    @AttributeOverride(name = "addressLine2", column = @Column(name = "shipping_address_line2")),
    @AttributeOverride(name = "city", column = @Column(name = "shipping_city")),
    @AttributeOverride(name = "state", column = @Column(name = "shipping_state")),
    @AttributeOverride(name = "postalCode", column = @Column(name = "shipping_postal_code")),
    @AttributeOverride(name = "country", column = @Column(name = "shipping_country"))
  })
  private Customer.Address shippingAddress;

  @Column(name = "tracking_number", length = 100)
  private String trackingNumber;

  @Column(name = "carrier", length = 100)
  private String carrier;

  @Column(name = "utm_source", length = 100)
  private String utmSource;

  @Column(name = "utm_medium", length = 100)
  private String utmMedium;

  @Column(name = "utm_campaign", length = 100)
  private String utmCampaign;

  @Column(columnDefinition = "TEXT")
  private String notes;

  @Column(name = "cancelled_at")
  private Instant cancelledAt;

  @Column(name = "cancelled_reason", length = 500)
  private String cancelledReason;

  @CreatedDate
  @Column(name = "created_at", nullable = false, updatable = false)
  private Instant createdAt;

  @LastModifiedDate
  @Column(nullable = false)
  private Instant updatedAt;

  @Version private Long version;

  public enum OrderStatus {
    PENDING,
    CONFIRMED,
    PROCESSING,
    SHIPPED,
    DELIVERED,
    CANCELLED,
    REFUNDED
  }

  public enum PaymentStatus {
    PENDING,
    AUTHORIZED,
    PAID,
    PARTIALLY_REFUNDED,
    REFUNDED,
    FAILED
  }

  public enum FulfillmentStatus {
    UNFULFILLED,
    PARTIALLY_FULFILLED,
    FULFILLED
  }
}
