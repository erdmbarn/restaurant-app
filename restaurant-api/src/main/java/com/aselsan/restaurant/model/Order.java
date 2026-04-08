package com.aselsan.restaurant.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.aselsan.restaurant.dto.request.RefundRequest;
import com.aselsan.restaurant.enums.OrderStatus;

@Document(collection = "orders")
public class Order {
    @Id private String id;
    private String userId;
    private String menuId;
    private List<OrderItem> items = new ArrayList<>();
    private OrderStatus status = OrderStatus.IN_PROGRESS;
    private BigDecimal totalPrice;
    private BigDecimal discountApplied;
    private String refundReason;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;

    public Order() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final Order o = new Order();
        public Builder id(String v) { o.id = v; return this; }
        public Builder userId(String v) { o.userId = v; return this; }
        public Builder menuId(String v) { o.menuId = v; return this; }
        public Builder items(List<OrderItem> v) { o.items = v; return this; }
        public Builder status(OrderStatus v) { o.status = v; return this; }
        public Order build() { return o; }
    }

    public void recalculateTotal() {
        this.totalPrice = items.stream()
                .map(OrderItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getMenuId() { return menuId; }
    public void setMenuId(String menuId) { this.menuId = menuId; }
    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }
    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }
    public BigDecimal getDiscountApplied() { return discountApplied; }
    public void setDiscountApplied(BigDecimal discountApplied) { this.discountApplied = discountApplied; }
    public String getRefundReason() { return refundReason; }
    public void setRefundReason(String refundReason) { this.refundReason = refundReason; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    private List<RefundRequest.RefundItem> refundItems;

public List<RefundRequest.RefundItem> getRefundItems() { return refundItems; }
public void setRefundItems(List<RefundRequest.RefundItem> refundItems) { this.refundItems = refundItems; }
}
