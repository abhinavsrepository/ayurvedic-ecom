package com.ayur.admin.web.rest;

import com.ayur.admin.service.OrderService;
import com.ayur.admin.service.dto.OrderDetailResponse;
import com.ayur.admin.service.dto.OrderListResponse;
import com.ayur.admin.service.dto.OrderStatusUpdateRequest;
import com.ayur.admin.service.dto.RefundRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "Orders", description = "Order management endpoints")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    @Operation(summary = "List orders", description = "Get paginated list of orders with filters")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS', 'FINANCE')")
    public ResponseEntity<Page<OrderListResponse>> listOrders(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String paymentStatus,
            @RequestParam(required = false) String fulfillmentStatus,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant toDate,
            @RequestParam(required = false) String customerEmail) {

        Page<OrderListResponse> orders = orderService.listOrders(
            pageable, status, paymentStatus, fulfillmentStatus, fromDate, toDate, customerEmail
        );
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{orderId}")
    @Operation(summary = "Get order details", description = "Get full order details including items and timeline")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS', 'FINANCE')")
    public ResponseEntity<OrderDetailResponse> getOrder(@PathVariable UUID orderId) {
        OrderDetailResponse order = orderService.getOrderDetails(orderId);
        return ResponseEntity.ok(order);
    }

    @PatchMapping("/{orderId}/status")
    @Operation(summary = "Update order status", description = "Update order status with audit trail")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS')")
    public ResponseEntity<OrderDetailResponse> updateOrderStatus(
            @PathVariable UUID orderId,
            @Valid @RequestBody OrderStatusUpdateRequest request) {
        OrderDetailResponse order = orderService.updateOrderStatus(orderId, request);
        return ResponseEntity.ok(order);
    }

    @PostMapping("/{orderId}/refund")
    @Operation(summary = "Process refund", description = "Process full or partial refund for an order")
    @PreAuthorize("hasAnyRole('ADMIN', 'FINANCE')")
    public ResponseEntity<RefundResponse> processRefund(
            @PathVariable UUID orderId,
            @Valid @RequestBody RefundRequest request) {
        RefundResponse response = orderService.processRefund(orderId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/export/csv")
    @Operation(summary = "Export orders", description = "Export orders to CSV with streaming response")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS', 'FINANCE')")
    public ResponseEntity<byte[]> exportOrders(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant toDate) {
        byte[] csv = orderService.exportToCsv(status, fromDate, toDate);
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=orders.csv")
                .header("Content-Type", "text/csv")
                .body(csv);
    }

    // Inner DTO
    public record RefundResponse(UUID refundId, String status, String amount, String message) {}
}
