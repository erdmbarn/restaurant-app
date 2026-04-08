package com.aselsan.restaurant.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.aselsan.restaurant.model.Product;

public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findByAvailableTrue();
}