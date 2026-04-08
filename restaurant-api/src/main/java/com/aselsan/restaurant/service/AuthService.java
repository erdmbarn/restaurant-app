package com.aselsan.restaurant.service;

import com.aselsan.restaurant.dto.request.LoginRequest;
import com.aselsan.restaurant.dto.request.RegisterRequest;
import com.aselsan.restaurant.dto.response.AuthResponse;
import com.aselsan.restaurant.exception.RestaurantException;
import com.aselsan.restaurant.model.User;
import com.aselsan.restaurant.repository.UserRepository;
import com.aselsan.restaurant.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw RestaurantException.conflict("Email already in use: " + request.getEmail());
        }
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(request.getRole())
                .build();
        User saved = userRepository.save(user);
        String token = jwtUtil.generateToken(saved.getId(), saved.getEmail(), saved.getRole().name());
        return buildAuthResponse(saved, token);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> RestaurantException.badRequest("Invalid email or password"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw RestaurantException.badRequest("Invalid email or password");
        }
        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return buildAuthResponse(user, token);
    }

    private AuthResponse buildAuthResponse(User user, String token) {
        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .build();
    }
}
