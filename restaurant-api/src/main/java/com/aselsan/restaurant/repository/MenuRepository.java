package com.aselsan.restaurant.repository;

import com.aselsan.restaurant.model.Menu;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MenuRepository extends MongoRepository<Menu, String> {
    Optional<Menu> findByDate(LocalDate date);
    List<Menu> findByDateBetween(LocalDate start, LocalDate end);
    boolean existsByDate(LocalDate date);
}
