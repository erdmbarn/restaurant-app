package com.aselsan.restaurant.model;

import com.aselsan.restaurant.enums.MenuCategory;
import java.math.BigDecimal;
import java.util.UUID;

public class MenuItem {
    private String id = UUID.randomUUID().toString();
    private String name;
    private String description;
    private BigDecimal price;
    private MenuCategory category;
    private boolean available = true;

    public MenuItem() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final MenuItem m = new MenuItem();
        public Builder id(String v) { m.id = v; return this; }
        public Builder name(String v) { m.name = v; return this; }
        public Builder description(String v) { m.description = v; return this; }
        public Builder price(BigDecimal v) { m.price = v; return this; }
        public Builder category(MenuCategory v) { m.category = v; return this; }
        public Builder available(boolean v) { m.available = v; return this; }
        public MenuItem build() { return m; }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public MenuCategory getCategory() { return category; }
    public void setCategory(MenuCategory category) { this.category = category; }
    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
}
