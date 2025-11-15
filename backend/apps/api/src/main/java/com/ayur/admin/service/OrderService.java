package com.ayur.admin.service;

import com.ayur.admin.domain.Order;
import com.ayur.admin.repository.OrderRepository;
import com.ayur.admin.service.dto.*;
import com.ayur.admin.web.rest.OrderController;
import java.time.Instant;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

  private final OrderRepository orderRepository;

  @Transactional(readOnly = true)
  public Page<OrderListResponse> listOrders(
      Pageable pageable,
      String status,
      String paymentStatus,
      String fulfillmentStatus,
      Instant fromDate,
      Instant toDate,
      String customerEmail) {

    Page<Order> orders =
        orderRepository.findOrdersWithFilters(
            status, paymentStatus, fulfillmentStatus, fromDate, toDate, customerEmail, pageable);

    return orders.map(
        order ->
            OrderListResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .customerName(
                    order.getCustomer().getFirstName() + " " + order.getCustomer().getLastName())
                .customerEmail(order.getCustomer().getEmail())
                .status(order.getStatus().name())
                .paymentStatus(order.getPaymentStatus().name())
                .fulfillmentStatus(order.getFulfillmentStatus().name())
                .total(order.getTotal())
                .itemsCount(order.getItems().size())
                .createdAt(order.getCreatedAt())
                .build());
  }

  @Transactional(readOnly = true)
  public OrderDetailResponse getOrderDetails(UUID orderId) {
    Order order =
        orderRepository
            .findById(orderId)
            .orElseThrow(() -> new IllegalArgumentException("Order not found"));

    return OrderDetailResponse.builder()
        .id(order.getId())
        .orderNumber(order.getOrderNumber())
        .customer(
            OrderDetailResponse.CustomerInfo.builder()
                .id(order.getCustomer().getId())
                .firstName(order.getCustomer().getFirstName())
                .lastName(order.getCustomer().getLastName())
                .email(order.getCustomer().getEmail())
                .phoneNumber(order.getCustomer().getPhoneNumber())
                .build())
        .status(order.getStatus().name())
        .paymentStatus(order.getPaymentStatus().name())
        .fulfillmentStatus(order.getFulfillmentStatus().name())
        .items(
            order.getItems().stream()
                .map(
                    item ->
                        OrderDetailResponse.OrderItemDto.builder()
                            .id(item.getId())
                            .sku(item.getSku())
                            .productName(item.getProductName())
                            .quantity(item.getQuantity())
                            .unitPrice(item.getUnitPrice())
                            .lineTotal(item.getLineTotal())
                            .discountAmount(item.getDiscountAmount())
                            .build())
                .collect(Collectors.toList()))
        .subtotal(order.getSubtotal())
        .taxAmount(order.getTaxAmount())
        .shippingAmount(order.getShippingAmount())
        .discountAmount(order.getDiscountAmount())
        .total(order.getTotal())
        .couponCode(order.getCouponCode())
        .trackingNumber(order.getTrackingNumber())
        .carrier(order.getCarrier())
        .utmSource(order.getUtmSource())
        .utmMedium(order.getUtmMedium())
        .utmCampaign(order.getUtmCampaign())
        .notes(order.getNotes())
        .createdAt(order.getCreatedAt())
        .updatedAt(order.getUpdatedAt())
        .build();
  }

  @Transactional
  public OrderDetailResponse updateOrderStatus(UUID orderId, OrderStatusUpdateRequest request) {
    Order order =
        orderRepository
            .findById(orderId)
            .orElseThrow(() -> new IllegalArgumentException("Order not found"));

    order.setStatus(Order.OrderStatus.valueOf(request.getStatus()));
    if (request.getPaymentStatus() != null) {
      order.setPaymentStatus(Order.PaymentStatus.valueOf(request.getPaymentStatus()));
    }
    if (request.getFulfillmentStatus() != null) {
      order.setFulfillmentStatus(Order.FulfillmentStatus.valueOf(request.getFulfillmentStatus()));
    }
    if (request.getTrackingNumber() != null) {
      order.setTrackingNumber(request.getTrackingNumber());
    }
    if (request.getCarrier() != null) {
      order.setCarrier(request.getCarrier());
    }
    if (request.getNotes() != null) {
      order.setNotes(request.getNotes());
    }

    order = orderRepository.save(order);
    log.info("Updated order {} status to {}", order.getOrderNumber(), order.getStatus());

    return getOrderDetails(orderId);
  }

  @Transactional
  public OrderController.RefundResponse processRefund(UUID orderId, RefundRequest request) {
    Order order =
        orderRepository
            .findById(orderId)
            .orElseThrow(() -> new IllegalArgumentException("Order not found"));

    if (request.getAmount().compareTo(order.getTotal()) > 0) {
      throw new IllegalArgumentException("Refund amount cannot exceed order total");
    }

    // TODO: Process actual refund through payment gateway
    order.setStatus(Order.OrderStatus.REFUNDED);
    order.setPaymentStatus(Order.PaymentStatus.REFUNDED);
    orderRepository.save(order);

    log.info("Processed refund for order {}: {}", order.getOrderNumber(), request.getAmount());

    return new OrderController.RefundResponse(
        UUID.randomUUID(),
        "SUCCESS",
        request.getAmount().toString(),
        "Refund processed successfully");
  }

  public byte[] exportToCsv(String status, Instant fromDate, Instant toDate) {
    // TODO: Implement CSV export
    return new byte[0];
  }
}
