package com.aselsan.restaurant.dto.request;

import java.util.List;

import jakarta.validation.constraints.NotBlank;

public class RefundRequest {
    @NotBlank private String reason;
    private List<RefundItem> items;

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public List<RefundItem> getItems() { return items; }
    public void setItems(List<RefundItem> items) { this.items = items; }

    public static class RefundItem {
        private String menuItemId;
        private int quantity;

        public String getMenuItemId() { return menuItemId; }
        public void setMenuItemId(String menuItemId) { this.menuItemId = menuItemId; }
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
    }
}