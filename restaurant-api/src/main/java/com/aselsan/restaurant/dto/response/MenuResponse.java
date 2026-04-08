package com.aselsan.restaurant.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class MenuResponse {
    private String id;
    private LocalDate date;
    private List<MenuItemResponse> items;
    private boolean active;
    private LocalDateTime createdAt;

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final MenuResponse r = new MenuResponse();
        public Builder id(String v) { r.id = v; return this; }
        public Builder date(LocalDate v) { r.date = v; return this; }
        public Builder items(List<MenuItemResponse> v) { r.items = v; return this; }
        public Builder active(boolean v) { r.active = v; return this; }
        public Builder createdAt(LocalDateTime v) { r.createdAt = v; return this; }
        public MenuResponse build() { return r; }
    }

    public String getId() { return id; }
    public LocalDate getDate() { return date; }
    public List<MenuItemResponse> getItems() { return items; }
    public boolean isActive() { return active; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
