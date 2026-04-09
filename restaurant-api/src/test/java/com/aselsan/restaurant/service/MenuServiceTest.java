package com.aselsan.restaurant.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.aselsan.restaurant.dto.request.CreateMenuRequest;
import com.aselsan.restaurant.dto.response.MenuResponse;
import com.aselsan.restaurant.enums.MenuCategory;
import com.aselsan.restaurant.exception.RestaurantException;
import com.aselsan.restaurant.model.Menu;
import com.aselsan.restaurant.model.MenuItem;
import com.aselsan.restaurant.repository.MenuRepository;
import com.aselsan.restaurant.repository.ProductRepository;

@ExtendWith(MockitoExtension.class)
@DisplayName("MenuService Unit Tests")
class MenuServiceTest {

    @Mock
    private MenuRepository menuRepository;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private MenuService menuService;

    private Menu sampleMenu;

    @BeforeEach
    void setUp() {
        MenuItem item = MenuItem.builder()
                .id("item-1").name("Mercimek Corbasi")
                .price(new BigDecimal("35.00")).category(MenuCategory.SOUP).available(true).build();
        sampleMenu = Menu.builder()
                .id("menu-1").date(LocalDate.now()).items(List.of(item)).active(true).build();
    }

    @Test
    @DisplayName("Should return today's menu when it exists")
    void getTodayMenu_WhenMenuExists_ReturnsMenuResponse() {
        when(menuRepository.findByDate(LocalDate.now())).thenReturn(Optional.of(sampleMenu));
        MenuResponse response = menuService.getTodayMenu();
        assertThat(response).isNotNull();
        assertThat(response.getDate()).isEqualTo(LocalDate.now());
        assertThat(response.getItems()).hasSize(1);
    }

    @Test
    @DisplayName("Should throw NOT_FOUND when today's menu doesn't exist")
    void getTodayMenu_WhenNoMenu_ThrowsException() {
        when(menuRepository.findByDate(LocalDate.now())).thenReturn(Optional.empty());
        assertThatThrownBy(() -> menuService.getTodayMenu())
                .isInstanceOf(RestaurantException.class)
                .hasMessageContaining("No menu available for today");
    }

    @Test
    @DisplayName("Should throw CONFLICT when menu for date already exists")
    void createMenu_WhenDateExists_ThrowsConflict() {
        CreateMenuRequest request = new CreateMenuRequest();
        request.setDate(LocalDate.now());
        request.setProductIds(List.of("product-1"));
        when(menuRepository.existsByDate(LocalDate.now())).thenReturn(true);
        assertThatThrownBy(() -> menuService.createMenu(request))
                .isInstanceOf(RestaurantException.class)
                .hasMessageContaining("Menu already exists");
    }
}