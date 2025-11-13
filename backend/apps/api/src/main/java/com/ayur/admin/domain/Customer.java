package com.ayur.admin.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.envers.Audited;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "customers", indexes = {
    @Index(name = "idx_customer_email", columnList = "email"),
    @Index(name = "idx_customer_phone", columnList = "phone_number")
})
@Audited
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(name = "total_orders")
    private Integer totalOrders = 0;

    @Column(name = "total_spent", precision = 10, scale = 2)
    private BigDecimal totalSpent = BigDecimal.ZERO;

    @Column(name = "lifetime_value", precision = 10, scale = 2)
    private BigDecimal lifetimeValue = BigDecimal.ZERO;

    @Column(name = "average_order_value", precision = 10, scale = 2)
    private BigDecimal averageOrderValue = BigDecimal.ZERO;

    @Column(name = "last_order_at")
    private Instant lastOrderAt;

    @Embedded
    private Address shippingAddress;

    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "addressLine1", column = @Column(name = "billing_address_line1")),
        @AttributeOverride(name = "addressLine2", column = @Column(name = "billing_address_line2")),
        @AttributeOverride(name = "city", column = @Column(name = "billing_city")),
        @AttributeOverride(name = "state", column = @Column(name = "billing_state")),
        @AttributeOverride(name = "postalCode", column = @Column(name = "billing_postal_code")),
        @AttributeOverride(name = "country", column = @Column(name = "billing_country"))
    })
    private Address billingAddress;

    @Column(name = "accepts_marketing")
    private Boolean acceptsMarketing = false;

    @Column(length = 500)
    private String notes;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private Instant updatedAt;

    @Version
    private Long version;

    @Embeddable
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Address {
        @Column(name = "address_line1", length = 255)
        private String addressLine1;

        @Column(name = "address_line2", length = 255)
        private String addressLine2;

        @Column(length = 100)
        private String city;

        @Column(length = 100)
        private String state;

        @Column(name = "postal_code", length = 20)
        private String postalCode;

        @Column(length = 100)
        private String country;
    }
}
