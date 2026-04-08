package com.aselsan.restaurant.dto.request;

import com.aselsan.restaurant.enums.OrderStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateOrderStatusRequest {
    @NotNull private OrderStatus status;

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
}
