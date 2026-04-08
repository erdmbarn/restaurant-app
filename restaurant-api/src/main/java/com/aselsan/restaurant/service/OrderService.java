package com.aselsan.restaurant.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.aselsan.restaurant.dto.request.CreateOrderRequest;
import com.aselsan.restaurant.dto.request.RefundRequest;
import com.aselsan.restaurant.dto.request.UpdateOrderStatusRequest;
import com.aselsan.restaurant.dto.response.OrderItemResponse;
import com.aselsan.restaurant.dto.response.OrderResponse;
import com.aselsan.restaurant.enums.OrderStatus;
import com.aselsan.restaurant.exception.RestaurantException;
import com.aselsan.restaurant.model.Menu;
import com.aselsan.restaurant.model.MenuItem;
import com.aselsan.restaurant.model.Order;
import com.aselsan.restaurant.model.OrderItem;
import com.aselsan.restaurant.repository.OrderRepository;
import com.aselsan.restaurant.repository.UserRepository;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final MenuService menuService;
    private final UserRepository userRepository;

    private static final List<OrderStatus> MODIFIABLE_STATUSES = List.of(OrderStatus.IN_PROGRESS);

    public OrderService(OrderRepository orderRepository, MenuService menuService, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.menuService = menuService;
        this.userRepository = userRepository;
    }

    public OrderResponse createOrder(String userId, CreateOrderRequest request) {
        Menu menu = menuService.findById(request.getMenuId());

        List<OrderItem> orderItems = request.getItems().stream().map(itemReq -> {
            MenuItem menuItem = menu.getItems().stream()
                    .filter(i -> i.getId().equals(itemReq.getMenuItemId()))
                    .findFirst()
                    .orElseThrow(() -> RestaurantException.notFound("Menu item not found: " + itemReq.getMenuItemId()));
            if (!menuItem.isAvailable()) {
                throw RestaurantException.badRequest("Item not available: " + menuItem.getName());
            }
            return OrderItem.builder()
                    .menuItemId(menuItem.getId())
                    .name(menuItem.getName())
                    .price(menuItem.getPrice())
                    .quantity(itemReq.getQuantity())
                    .build();
        }).collect(Collectors.toList());

        Order order = Order.builder()
                .userId(userId)
                .menuId(request.getMenuId())
                .items(orderItems)
                .build();
        order.recalculateTotal();
        applyDiscount(userId, order);

        Order saved = orderRepository.save(order);

        userRepository.findById(userId).ifPresent(user -> {
            user.setOrderCount(user.getOrderCount() + 1);
            userRepository.save(user);
        });

        return toResponse(saved);
    }

    public OrderResponse getOrderById(String orderId, String userId, String role) {
        Order order = findById(orderId);
        if ("CUSTOMER".equals(role) && !order.getUserId().equals(userId)) {
            throw RestaurantException.forbidden("You can only view your own orders");
        }
        return toResponse(order);
    }

    public List<OrderResponse> getMyOrders(String userId) {
        return orderRepository.findByUserId(userId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public OrderResponse addItemToOrder(String orderId, String userId, CreateOrderRequest.OrderItemRequest itemReq) {
        Order order = findById(orderId);
        assertOwner(order, userId);
        assertModifiable(order);

        Menu menu = menuService.findById(order.getMenuId());
        MenuItem menuItem = menu.getItems().stream()
                .filter(i -> i.getId().equals(itemReq.getMenuItemId()))
                .findFirst()
                .orElseThrow(() -> RestaurantException.notFound("Menu item not found"));

        order.getItems().stream()
                .filter(i -> i.getMenuItemId().equals(itemReq.getMenuItemId()))
                .findFirst()
                .ifPresentOrElse(
                        existing -> existing.setQuantity(existing.getQuantity() + itemReq.getQuantity()),
                        () -> order.getItems().add(OrderItem.builder()
                                .menuItemId(menuItem.getId())
                                .name(menuItem.getName())
                                .price(menuItem.getPrice())
                                .quantity(itemReq.getQuantity())
                                .build())
                );
        order.recalculateTotal();
order.setDiscountApplied(BigDecimal.ZERO);
applyDiscount(userId, order);
order.setUpdatedAt(LocalDateTime.now());
return toResponse(orderRepository.save(order));
    }

   public OrderResponse removeItemFromOrder(String orderId, String userId, String menuItemId) {
    Order order = findById(orderId);
    assertOwner(order, userId);
    assertModifiable(order);

    order.getItems().stream()
            .filter(i -> i.getMenuItemId().equals(menuItemId))
            .findFirst()
            .ifPresentOrElse(existing -> {
                if (existing.getQuantity() > 1) {
                    existing.setQuantity(existing.getQuantity() - 1);
                } else {
                    order.getItems().remove(existing);
                }
            }, () -> { throw RestaurantException.notFound("Item not in order"); });

    if (order.getItems().isEmpty()) throw RestaurantException.badRequest("Order must have at least one item");

    order.recalculateTotal();
    order.setDiscountApplied(BigDecimal.ZERO);
    applyDiscount(userId, order);
    order.setUpdatedAt(LocalDateTime.now());
    return toResponse(orderRepository.save(order));
}

    public OrderResponse updateStatus(String orderId, UpdateOrderStatusRequest request) {
        Order order = findById(orderId);
        order.setStatus(request.getStatus());
        order.setUpdatedAt(LocalDateTime.now());
        return toResponse(orderRepository.save(order));
    }
    public OrderResponse cancelOrder(String orderId, String userId) {
    Order order = findById(orderId);
    assertOwner(order, userId);
    assertModifiable(order);
    order.setStatus(OrderStatus.CANCELLED);
    order.setUpdatedAt(LocalDateTime.now());
    return toResponse(orderRepository.save(order));
}

   public OrderResponse requestRefund(String orderId, String userId, RefundRequest request) {
    Order order = findById(orderId);
    assertOwner(order, userId);
    if (order.getStatus() != OrderStatus.DELIVERED) {
        throw RestaurantException.badRequest("Refund only for delivered orders");
    }
    order.setStatus(OrderStatus.REFUND_REQUESTED);
    order.setRefundReason(request.getReason());
    order.setRefundItems(request.getItems());
    order.setUpdatedAt(LocalDateTime.now());
    return toResponse(orderRepository.save(order));
}

    private void applyDiscount(String userId, Order order) {
        userRepository.findById(userId).ifPresent(user -> {
            long count = user.getOrderCount();
            double rate = count >= 20 ? 0.15 : count >= 10 ? 0.10 : count >= 5 ? 0.05 : 0.0;
            if (rate > 0) {
                BigDecimal discount = order.getTotalPrice().multiply(BigDecimal.valueOf(rate));
                order.setDiscountApplied(discount);
                order.setTotalPrice(order.getTotalPrice().subtract(discount));
            }
        });
    }

    private void assertOwner(Order order, String userId) {
        if (!order.getUserId().equals(userId)) {
            throw RestaurantException.forbidden("You can only modify your own orders");
        }
    }

    private void assertModifiable(Order order) {
        if (!MODIFIABLE_STATUSES.contains(order.getStatus())) {
            throw RestaurantException.badRequest("Order cannot be modified in status: " + order.getStatus());
        }
    }

    private Order findById(String id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> RestaurantException.notFound("Order not found: " + id));
    }

    public OrderResponse toResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .menuId(order.getMenuId())
                .status(order.getStatus())
                .totalPrice(order.getTotalPrice())
                .discountApplied(order.getDiscountApplied())
                .refundReason(order.getRefundReason())
                .refundItems(order.getRefundItems())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .items(order.getItems().stream().map(i -> OrderItemResponse.builder()
                        .menuItemId(i.getMenuItemId())
                        .name(i.getName())
                        .price(i.getPrice())
                        .quantity(i.getQuantity())
                        .subtotal(i.getSubtotal())
                        .build()).collect(Collectors.toList()))
                .build();
    }
}
