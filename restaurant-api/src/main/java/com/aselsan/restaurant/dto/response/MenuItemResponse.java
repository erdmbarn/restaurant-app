package com.aselsan.restaurant.dto.response;

import com.aselsan.restaurant.enums.MenuCategory;
import java.math.BigDecimal;

public class MenuItemResponse {
    private String id;
    private String name;
    private String description;
    private BigDecimal price;
    private MenuCategory category;
    private boolean available;

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final MenuItemResponse r = new MenuItemResponse();
        public Builder id(String v) { r.id = v; return this; }
        public Builder name(String v) { r.name = v; return this; }
        public Builder description(String v) { r.description = v; return this; }
        public Builder price(BigDecimal v) { r.price = v; return this; }
        public Builder category(MenuCategory v) { r.category = v; return this; }
        public Builder available(boolean v) { r.available = v; return this; }
        public MenuItemResponse build() { return r; }
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public BigDecimal getPrice() { return price; }
    public MenuCategory getCategory() { return category; }
    public boolean isAvailable() { return available; }
}
