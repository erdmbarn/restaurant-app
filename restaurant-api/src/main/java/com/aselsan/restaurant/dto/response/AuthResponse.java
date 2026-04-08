package com.aselsan.restaurant.dto.response;

import com.aselsan.restaurant.enums.UserRole;

public class AuthResponse {
    private String token;
    private String userId;
    private String email;
    private String fullName;
    private UserRole role;

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final AuthResponse r = new AuthResponse();
        public Builder token(String v) { r.token = v; return this; }
        public Builder userId(String v) { r.userId = v; return this; }
        public Builder email(String v) { r.email = v; return this; }
        public Builder fullName(String v) { r.fullName = v; return this; }
        public Builder role(UserRole v) { r.role = v; return this; }
        public AuthResponse build() { return r; }
    }

    public String getToken() { return token; }
    public String getUserId() { return userId; }
    public String getEmail() { return email; }
    public String getFullName() { return fullName; }
    public UserRole getRole() { return role; }
}
