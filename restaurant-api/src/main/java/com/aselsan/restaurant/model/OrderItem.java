package com.aselsan.restaurant.model;

import java.math.BigDecimal;

public class OrderItem {
    private String menuItemId;
    private String name;
    private BigDecimal price;
    private int quantity;

    public OrderItem() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final OrderItem o = new OrderItem();
        public Builder menuItemId(String v) { o.menuItemId = v; return this; }
        public Builder name(String v) { o.name = v; return this; }
        public Builder price(BigDecimal v) { o.price = v; return this; }
        public Builder quantity(int v) { o.quantity = v; return this; }
        public OrderItem build() { return o; }
    }

    public BigDecimal getSubtotal() {
        return price.multiply(BigDecimal.valueOf(quantity));
    }

    public String getMenuItemId() { return menuItemId; }
    public void setMenuItemId(String menuItemId) { this.menuItemId = menuItemId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}
