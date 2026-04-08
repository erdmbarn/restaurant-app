package com.aselsan.restaurant.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aselsan.restaurant.dto.request.CreateOrderRequest;
import com.aselsan.restaurant.dto.request.RefundRequest;
import com.aselsan.restaurant.dto.request.UpdateOrderStatusRequest;
import com.aselsan.restaurant.dto.response.ApiResponse;
import com.aselsan.restaurant.dto.response.OrderResponse;
import com.aselsan.restaurant.service.OrderService;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "Order")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @Valid @RequestBody CreateOrderRequest request, Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Order created", orderService.createOrder((String) auth.getPrincipal(), request)));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getMyOrders(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getMyOrders((String) auth.getPrincipal())));
    }

    @GetMapping
    @PreAuthorize("hasRole('RESTAURANT')")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getAllOrders() {
        return ResponseEntity.ok(ApiResponse.success(orderService.getAllOrders()));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrder(
            @PathVariable String orderId, Authentication auth) {
        String userId = (String) auth.getPrincipal();
        String role = auth.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");
        return ResponseEntity.ok(ApiResponse.success(orderService.getOrderById(orderId, userId, role)));
    }

    @PostMapping("/{orderId}/items")
    public ResponseEntity<ApiResponse<OrderResponse>> addItem(
            @PathVariable String orderId,
            @Valid @RequestBody CreateOrderRequest.OrderItemRequest itemReq,
            Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success(
                orderService.addItemToOrder(orderId, (String) auth.getPrincipal(), itemReq)));
    }

    @DeleteMapping("/{orderId}/items/{menuItemId}")
    public ResponseEntity<ApiResponse<OrderResponse>> removeItem(
            @PathVariable String orderId, @PathVariable String menuItemId, Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success(
                orderService.removeItemFromOrder(orderId, (String) auth.getPrincipal(), menuItemId)));
    }

    @PatchMapping("/{orderId}/status")
    @PreAuthorize("hasRole('RESTAURANT')")
    public ResponseEntity<ApiResponse<OrderResponse>> updateStatus(
            @PathVariable String orderId, @Valid @RequestBody UpdateOrderStatusRequest request) {
        return ResponseEntity.ok(ApiResponse.success(orderService.updateStatus(orderId, request)));
    }

    @PostMapping("/{orderId}/refund")
    public ResponseEntity<ApiResponse<OrderResponse>> requestRefund(
            @PathVariable String orderId,
            @Valid @RequestBody RefundRequest request,
            Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success(
                orderService.requestRefund(orderId, (String) auth.getPrincipal(), request)));
    }
    @DeleteMapping("/{orderId}")
public ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(
        @PathVariable String orderId, Authentication auth) {
    return ResponseEntity.ok(ApiResponse.success(
            orderService.cancelOrder(orderId, (String) auth.getPrincipal())));
}
}
