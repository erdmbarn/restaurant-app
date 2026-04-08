package com.aselsan.restaurant.dto.response;

import java.math.BigDecimal;

public class OrderItemResponse {
    private String menuItemId;
    private String name;
    private BigDecimal price;
    private int quantity;
    private BigDecimal subtotal;

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final OrderItemResponse r = new OrderItemResponse();
        public Builder menuItemId(String v) { r.menuItemId = v; return this; }
        public Builder name(String v) { r.name = v; return this; }
        public Builder price(BigDecimal v) { r.price = v; return this; }
        public Builder quantity(int v) { r.quantity = v; return this; }
        public Builder subtotal(BigDecimal v) { r.subtotal = v; return this; }
        public OrderItemResponse build() { return r; }
    }

    public String getMenuItemId() { return menuItemId; }
    public String getName() { return name; }
    public BigDecimal getPrice() { return price; }
    public int getQuantity() { return quantity; }
    public BigDecimal getSubtotal() { return subtotal; }
}
