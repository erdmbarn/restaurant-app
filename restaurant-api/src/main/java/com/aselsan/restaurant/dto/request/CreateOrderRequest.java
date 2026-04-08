package com.aselsan.restaurant.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class CreateOrderRequest {
    @NotBlank private String menuId;
    @NotEmpty private List<OrderItemRequest> items;

    public String getMenuId() { return menuId; }
    public void setMenuId(String menuId) { this.menuId = menuId; }
    public List<OrderItemRequest> getItems() { return items; }
    public void setItems(List<OrderItemRequest> items) { this.items = items; }

    public static class OrderItemRequest {
        @NotBlank private String menuItemId;
        @Min(1) private int quantity;

        public String getMenuItemId() { return menuItemId; }
        public void setMenuItemId(String menuItemId) { this.menuItemId = menuItemId; }
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
    }
}
