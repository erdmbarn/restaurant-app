package com.aselsan.restaurant.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.aselsan.restaurant.dto.request.CreateMenuRequest;
import com.aselsan.restaurant.dto.response.MenuItemResponse;
import com.aselsan.restaurant.dto.response.MenuResponse;
import com.aselsan.restaurant.exception.RestaurantException;
import com.aselsan.restaurant.model.Menu;
import com.aselsan.restaurant.model.MenuItem;
import com.aselsan.restaurant.model.Product;
import com.aselsan.restaurant.repository.MenuRepository;
import com.aselsan.restaurant.repository.ProductRepository;

@Service
public class MenuService {

    private final MenuRepository menuRepository;
    private final ProductRepository productRepository;

    public MenuService(MenuRepository menuRepository, ProductRepository productRepository) {
        this.menuRepository = menuRepository;
        this.productRepository = productRepository;
    }

    public MenuResponse getTodayMenu() {
        Menu menu = menuRepository.findByDate(LocalDate.now())
                .orElseThrow(() -> RestaurantException.notFound("No menu available for today"));
        return toResponse(menu);
    }

    public MenuResponse getMenuByDate(LocalDate date) {
        Menu menu = menuRepository.findByDate(date)
                .orElseThrow(() -> RestaurantException.notFound("No menu available for " + date));
        return toResponse(menu);
    }

    public List<MenuResponse> getWeeklyMenus() {
        LocalDate today = LocalDate.now().minusDays(1);
        LocalDate endOfWeek = LocalDate.now().with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));
        return menuRepository.findByDateBetween(today, endOfWeek)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<MenuResponse> getMonthlyMenus(int year, int month) {
        LocalDate today = LocalDate.now();
        LocalDate requestedStart = LocalDate.of(year, month, 1);
        LocalDate startDate = requestedStart.isBefore(today)
                && requestedStart.getMonth() == today.getMonth()
                && requestedStart.getYear() == today.getYear()
                ? today.minusDays(1)
                : requestedStart.minusDays(1);
        LocalDate endOfMonth = LocalDate.of(year, month, 1).with(TemporalAdjusters.lastDayOfMonth());

        if (LocalDate.of(year, month, 1).plusMonths(1).isBefore(today)) {
            return List.of();
        }

        return menuRepository.findByDateBetween(startDate, endOfMonth)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public MenuResponse createMenu(CreateMenuRequest request) {
        if (menuRepository.existsByDate(request.getDate())) {
            throw RestaurantException.conflict("Menu already exists for date: " + request.getDate());
        }
        List<MenuItem> items = request.getProductIds().stream().map(productId -> {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> RestaurantException.notFound("Product not found: " + productId));
            return MenuItem.builder()
                    .id(UUID.randomUUID().toString())
                    .name(product.getName())
                    .description(product.getDescription())
                    .price(product.getPrice())
                    .category(product.getCategory())
                    .available(product.isAvailable())
                    .build();
        }).collect(Collectors.toList());
        Menu menu = Menu.builder().date(request.getDate()).items(items).build();
        return toResponse(menuRepository.save(menu));
    }

    public MenuResponse updateMenu(String menuId, CreateMenuRequest request) {
        Menu menu = findById(menuId);
        menu.setDate(request.getDate());
        List<MenuItem> items = request.getProductIds().stream().map(productId -> {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> RestaurantException.notFound("Product not found: " + productId));
            return MenuItem.builder()
                    .id(UUID.randomUUID().toString())
                    .name(product.getName())
                    .description(product.getDescription())
                    .price(product.getPrice())
                    .category(product.getCategory())
                    .available(product.isAvailable())
                    .build();
        }).collect(Collectors.toList());
        menu.setItems(items);
        menu.setUpdatedAt(LocalDateTime.now());
        return toResponse(menuRepository.save(menu));
    }

    public void deleteMenu(String menuId) {
        menuRepository.delete(findById(menuId));
    }

    public Menu findById(String id) {
        return menuRepository.findById(id)
                .orElseThrow(() -> RestaurantException.notFound("Menu not found: " + id));
    }

    public MenuResponse toResponse(Menu menu) {
        return MenuResponse.builder()
                .id(menu.getId())
                .date(menu.getDate())
                .active(menu.isActive())
                .createdAt(menu.getCreatedAt())
                .items(menu.getItems().stream().map(this::toItemResponse).collect(Collectors.toList()))
                .build();
    }

    private MenuItemResponse toItemResponse(MenuItem item) {
        return MenuItemResponse.builder()
                .id(item.getId())
                .name(item.getName())
                .description(item.getDescription())
                .price(item.getPrice())
                .category(item.getCategory())
                .available(item.isAvailable())
                .build();
    }
}