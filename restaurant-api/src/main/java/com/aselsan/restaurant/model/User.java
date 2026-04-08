package com.aselsan.restaurant.model;

import com.aselsan.restaurant.enums.UserRole;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;

@Document(collection = "users")
public class User {
    @Id private String id;
    @Indexed(unique = true) private String email;
    private String password;
    private String fullName;
    private UserRole role;
    private int orderCount = 0;
    private double discountRate = 0.0;
    private LocalDateTime createdAt = LocalDateTime.now();

    public User() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final User u = new User();
        public Builder id(String v) { u.id = v; return this; }
        public Builder email(String v) { u.email = v; return this; }
        public Builder password(String v) { u.password = v; return this; }
        public Builder fullName(String v) { u.fullName = v; return this; }
        public Builder role(UserRole v) { u.role = v; return this; }
        public Builder orderCount(int v) { u.orderCount = v; return this; }
        public User build() { return u; }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }
    public int getOrderCount() { return orderCount; }
    public void setOrderCount(int orderCount) { this.orderCount = orderCount; }
    public double getDiscountRate() { return discountRate; }
    public void setDiscountRate(double discountRate) { this.discountRate = discountRate; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
