package com.aselsan.restaurant.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "menus")
public class Menu {
    @Id private String id;
    @Indexed(unique = true) private LocalDate date;
    private List<MenuItem> items = new ArrayList<>();
    private boolean active = true;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;

    public Menu() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final Menu m = new Menu();
        public Builder id(String v) { m.id = v; return this; }
        public Builder date(LocalDate v) { m.date = v; return this; }
        public Builder items(List<MenuItem> v) { m.items = v; return this; }
        public Builder active(boolean v) { m.active = v; return this; }
        public Menu build() { return m; }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public List<MenuItem> getItems() { return items; }
    public void setItems(List<MenuItem> items) { this.items = items; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
