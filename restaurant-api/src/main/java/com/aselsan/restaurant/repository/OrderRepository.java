package com.aselsan.restaurant.repository;

import com.aselsan.restaurant.enums.OrderStatus;
import com.aselsan.restaurant.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByUserId(String userId);
    List<Order> findByStatus(OrderStatus status);
    long countByUserId(String userId);
}
