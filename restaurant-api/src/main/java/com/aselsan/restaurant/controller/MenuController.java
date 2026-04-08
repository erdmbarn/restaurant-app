package com.aselsan.restaurant.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aselsan.restaurant.dto.request.CreateMenuRequest;
import com.aselsan.restaurant.dto.response.ApiResponse;
import com.aselsan.restaurant.dto.response.MenuResponse;
import com.aselsan.restaurant.service.MenuService;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/menus")
@Tag(name = "Menu")
public class MenuController {

    private final MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    @GetMapping("/today")
    public ResponseEntity<ApiResponse<MenuResponse>> getTodayMenu() {
        return ResponseEntity.ok(ApiResponse.success(menuService.getTodayMenu()));
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<ApiResponse<MenuResponse>> getMenuByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(ApiResponse.success(menuService.getMenuByDate(date)));
    }

    @GetMapping("/week")
    public ResponseEntity<ApiResponse<List<MenuResponse>>> getWeeklyMenus() {
        return ResponseEntity.ok(ApiResponse.success(menuService.getWeeklyMenus()));
    }

   @GetMapping("/month")
public ResponseEntity<ApiResponse<List<MenuResponse>>> getMonthlyMenus(
        @RequestParam(defaultValue = "0") int year,
        @RequestParam(defaultValue = "0") int month) {
    int y = year == 0 ? LocalDate.now().getYear() : year;
    int m = month == 0 ? LocalDate.now().getMonthValue() : month;
    return ResponseEntity.ok(ApiResponse.success(menuService.getMonthlyMenus(y, m)));
}

    @PostMapping
    @PreAuthorize("hasRole('RESTAURANT')")
    public ResponseEntity<ApiResponse<MenuResponse>> createMenu(@Valid @RequestBody CreateMenuRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Menu created", menuService.createMenu(request)));
    }

    @PutMapping("/{menuId}")
    @PreAuthorize("hasRole('RESTAURANT')")
    public ResponseEntity<ApiResponse<MenuResponse>> updateMenu(
            @PathVariable String menuId, @Valid @RequestBody CreateMenuRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Menu updated", menuService.updateMenu(menuId, request)));
    }

    @DeleteMapping("/{menuId}")
    @PreAuthorize("hasRole('RESTAURANT')")
    public ResponseEntity<ApiResponse<Void>> deleteMenu(@PathVariable String menuId) {
        menuService.deleteMenu(menuId);
        return ResponseEntity.ok(ApiResponse.success("Menu deleted", null));
    }
}
