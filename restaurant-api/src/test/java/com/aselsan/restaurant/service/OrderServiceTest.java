package com.aselsan.restaurant.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.aselsan.restaurant.dto.request.CreateOrderRequest;
import com.aselsan.restaurant.dto.request.RefundRequest;
import com.aselsan.restaurant.dto.request.UpdateOrderStatusRequest;
import com.aselsan.restaurant.dto.response.OrderResponse;
import com.aselsan.restaurant.enums.OrderStatus;
import com.aselsan.restaurant.exception.RestaurantException;
import com.aselsan.restaurant.model.Menu;
import com.aselsan.restaurant.model.MenuItem;
import com.aselsan.restaurant.model.Order;
import com.aselsan.restaurant.model.OrderItem;
import com.aselsan.restaurant.model.User;
import com.aselsan.restaurant.repository.OrderRepository;
import com.aselsan.restaurant.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
@DisplayName("OrderService Unit Tests")
class OrderServiceTest {

    @Mock private OrderRepository orderRepository;
    @Mock private MenuService menuService;
    @Mock private UserRepository userRepository;

    @InjectMocks private OrderService orderService;

    private Order sampleOrder;

    @BeforeEach
    void setUp() {
        OrderItem orderItem = OrderItem.builder()
                .menuItemId("item-1").name("Tavuk Şiş")
                .price(new BigDecimal("85.00")).quantity(2).build();
        sampleOrder = Order.builder()
                .id("order-1").userId("user-1").menuId("menu-1")
                .items(new ArrayList<>(List.of(orderItem)))
                .status(OrderStatus.IN_PROGRESS).build();
        sampleOrder.setTotalPrice(new BigDecimal("170.00"));
    }

    @Test
    @DisplayName("Should update order status successfully")
    void updateStatus_ValidStatus_UpdatesOrder() {
        UpdateOrderStatusRequest request = new UpdateOrderStatusRequest();
        request.setStatus(OrderStatus.PREPARING);
        when(orderRepository.findById("order-1")).thenReturn(Optional.of(sampleOrder));
        when(orderRepository.save(any())).thenReturn(sampleOrder);
        OrderResponse response = orderService.updateStatus("order-1", request);
        assertThat(response.getStatus()).isEqualTo(OrderStatus.PREPARING);
    }

    @Test
    @DisplayName("Should throw FORBIDDEN when customer tries to view another's order")
    void getOrderById_WhenNotOwner_ThrowsForbidden() {
        when(orderRepository.findById("order-1")).thenReturn(Optional.of(sampleOrder));
        assertThatThrownBy(() -> orderService.getOrderById("order-1", "other-user", "CUSTOMER"))
                .isInstanceOf(RestaurantException.class)
                .hasMessageContaining("own orders");
    }

    @Test
    @DisplayName("Should not allow modifying order after PREPARING")
    void removeItem_WhenOrderPreparing_ThrowsBadRequest() {
        sampleOrder.setStatus(OrderStatus.PREPARING);
        when(orderRepository.findById("order-1")).thenReturn(Optional.of(sampleOrder));
        assertThatThrownBy(() -> orderService.removeItemFromOrder("order-1", "user-1", "item-1"))
                .isInstanceOf(RestaurantException.class)
                .hasMessageContaining("cannot be modified");
    }
    @Test
@DisplayName("Should create order successfully")
void createOrder_ValidRequest_ReturnsOrderResponse() {
    MenuItem menuItem = MenuItem.builder()
            .id("item-1").name("Izgara Tavuk")
            .price(new BigDecimal("120.00")).available(true)
            .category(com.aselsan.restaurant.enums.MenuCategory.MAIN_COURSE).build();
    Menu menu = Menu.builder()
            .id("menu-1").date(java.time.LocalDate.now())
            .items(List.of(menuItem)).build();
    User user = new User();
    user.setOrderCount(0);

    CreateOrderRequest request = new CreateOrderRequest();
    CreateOrderRequest.OrderItemRequest itemReq = new CreateOrderRequest.OrderItemRequest();
    itemReq.setMenuItemId("item-1");
    itemReq.setQuantity(1);
    request.setMenuId("menu-1");
    request.setItems(List.of(itemReq));

    when(menuService.findById("menu-1")).thenReturn(menu);
    when(orderRepository.save(any())).thenReturn(sampleOrder);
    when(userRepository.findById("user-1")).thenReturn(Optional.of(user));

    OrderResponse response = orderService.createOrder("user-1", request);
    assertThat(response).isNotNull();
}

@Test
@DisplayName("Should throw BAD_REQUEST when refund requested for non-delivered order")
void requestRefund_WhenNotDelivered_ThrowsBadRequest() {
    RefundRequest refundRequest = new RefundRequest();
    refundRequest.setReason("Yemek soguk geldi");
    when(orderRepository.findById("order-1")).thenReturn(Optional.of(sampleOrder));
    assertThatThrownBy(() -> orderService.requestRefund("order-1", "user-1", refundRequest))
            .isInstanceOf(RestaurantException.class)
            .hasMessageContaining("Refund only for delivered orders");
}

@Test
@DisplayName("Should throw BAD_REQUEST when cancelling non-modifiable order")
void cancelOrder_WhenPreparing_ThrowsBadRequest() {
    sampleOrder.setStatus(OrderStatus.PREPARING);
    when(orderRepository.findById("order-1")).thenReturn(Optional.of(sampleOrder));
    assertThatThrownBy(() -> orderService.cancelOrder("order-1", "user-1"))
            .isInstanceOf(RestaurantException.class)
            .hasMessageContaining("cannot be modified");
}
}
