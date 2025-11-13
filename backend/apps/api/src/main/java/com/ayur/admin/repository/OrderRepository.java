package com.ayur.admin.repository;

import com.ayur.admin.domain.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {

    Optional<Order> findByOrderNumber(String orderNumber);

    @Query("SELECT o FROM Order o WHERE " +
           "(:status IS NULL OR o.status = :status) " +
           "AND (:paymentStatus IS NULL OR o.paymentStatus = :paymentStatus) " +
           "AND (:fulfillmentStatus IS NULL OR o.fulfillmentStatus = :fulfillmentStatus) " +
           "AND (:fromDate IS NULL OR o.createdAt >= :fromDate) " +
           "AND (:toDate IS NULL OR o.createdAt <= :toDate) " +
           "AND (:customerEmail IS NULL OR o.customer.email = :customerEmail)")
    Page<Order> findOrdersWithFilters(
        @Param("status") String status,
        @Param("paymentStatus") String paymentStatus,
        @Param("fulfillmentStatus") String fulfillmentStatus,
        @Param("fromDate") Instant fromDate,
        @Param("toDate") Instant toDate,
        @Param("customerEmail") String customerEmail,
        Pageable pageable
    );

    @Query("SELECT o FROM Order o WHERE o.customer.id = :customerId ORDER BY o.createdAt DESC")
    List<Order> findByCustomerId(@Param("customerId") UUID customerId);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :since")
    Long countOrdersSince(@Param("since") Instant since);

    @Query("SELECT SUM(o.total) FROM Order o WHERE o.createdAt >= :since AND o.status NOT IN ('CANCELLED', 'REFUNDED')")
    BigDecimal sumRevenueSince(@Param("since") Instant since);

    @Query("SELECT AVG(o.total) FROM Order o WHERE o.createdAt >= :since AND o.status NOT IN ('CANCELLED', 'REFUNDED')")
    BigDecimal avgOrderValueSince(@Param("since") Instant since);

    @Query("SELECT o FROM Order o WHERE o.status = :status AND o.createdAt >= :since")
    List<Order> findByStatusSince(@Param("status") String status, @Param("since") Instant since);
}
