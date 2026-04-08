package com.aselsan.restaurant.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.aselsan.restaurant.enums.MenuCategory;

@Document(collection = "products")
public class Product {
    @Id private String id;
    private String name;
    private String description;
    private BigDecimal price;
    private MenuCategory category;
    private boolean available = true;
    private LocalDateTime createdAt = LocalDateTime.now();

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final Product p = new Product();
        public Builder name(String v) { p.name = v; return this; }
        public Builder description(String v) { p.description = v; return this; }
        public Builder price(BigDecimal v) { p.price = v; return this; }
        public Builder category(MenuCategory v) { p.category = v; return this; }
        public Builder available(boolean v) { p.available = v; return this; }
        public Product build() { return p; }
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
    public LocalDateTime getCreatedAt() { return createdAt; }
}