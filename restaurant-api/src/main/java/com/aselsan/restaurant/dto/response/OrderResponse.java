package com.aselsan.restaurant.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.aselsan.restaurant.dto.request.RefundRequest;
import com.aselsan.restaurant.enums.OrderStatus;

public class OrderResponse {
    private String id;
    private String userId;
    private String menuId;
    private List<OrderItemResponse> items;
    private OrderStatus status;
    private BigDecimal totalPrice;
    private BigDecimal discountApplied;
    private String refundReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<RefundRequest.RefundItem> refundItems;

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final OrderResponse r = new OrderResponse();
        public Builder id(String v) { r.id = v; return this; }
        public Builder userId(String v) { r.userId = v; return this; }
        public Builder menuId(String v) { r.menuId = v; return this; }
        public Builder items(List<OrderItemResponse> v) { r.items = v; return this; }
        public Builder status(OrderStatus v) { r.status = v; return this; }
        public Builder totalPrice(BigDecimal v) { r.totalPrice = v; return this; }
        public Builder discountApplied(BigDecimal v) { r.discountApplied = v; return this; }
        public Builder refundReason(String v) { r.refundReason = v; return this; }
        public Builder createdAt(LocalDateTime v) { r.createdAt = v; return this; }
        public Builder updatedAt(LocalDateTime v) { r.updatedAt = v; return this; }
        public OrderResponse build() { return r; }
        public Builder refundItems(List<RefundRequest.RefundItem> v) { r.refundItems = v; return this; }
    }

    public String getId() { return id; }
    public String getUserId() { return userId; }
    public String getMenuId() { return menuId; }
    public List<OrderItemResponse> getItems() { return items; }
    public OrderStatus getStatus() { return status; }
    public BigDecimal getTotalPrice() { return totalPrice; }
    public BigDecimal getDiscountApplied() { return discountApplied; }
    public String getRefundReason() { return refundReason; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public List<RefundRequest.RefundItem> getRefundItems() { return refundItems; }
}
