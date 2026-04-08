package com.aselsan.restaurant.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.aselsan.restaurant.dto.request.ProductRequest;
import com.aselsan.restaurant.dto.response.ProductResponse;
import com.aselsan.restaurant.exception.RestaurantException;
import com.aselsan.restaurant.model.Menu;
import com.aselsan.restaurant.model.MenuItem;
import com.aselsan.restaurant.model.Product;
import com.aselsan.restaurant.repository.MenuRepository;
import com.aselsan.restaurant.repository.ProductRepository;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final MenuRepository menuRepository;

    public ProductService(ProductRepository productRepository, MenuRepository menuRepository) {
        this.productRepository = productRepository;
        this.menuRepository = menuRepository;
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<ProductResponse> getAvailableProducts() {
        return productRepository.findByAvailableTrue().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ProductResponse createProduct(ProductRequest request) {
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .category(request.getCategory())
                .available(request.isAvailable())
                .build();
        return toResponse(productRepository.save(product));
    }

    public ProductResponse updateProduct(String id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> RestaurantException.notFound("Product not found: " + id));

        String oldName = product.getName();

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(request.getCategory());
        product.setAvailable(request.isAvailable());

        Product saved = productRepository.save(product);

        // Tum menulerdeki ayni urunleri guncelle
        List<Menu> allMenus = menuRepository.findAll();
        for (Menu menu : allMenus) {
            boolean changed = false;
            for (MenuItem item : menu.getItems()) {
                if (item.getName().equals(oldName)) {
                    item.setName(saved.getName());
                    item.setDescription(saved.getDescription());
                    item.setPrice(saved.getPrice());
                    item.setCategory(saved.getCategory());
                    item.setAvailable(saved.isAvailable());
                    changed = true;
                }
            }
            if (changed) menuRepository.save(menu);
        }

        return toResponse(saved);
    }

    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }

    public Product findById(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> RestaurantException.notFound("Product not found: " + id));
    }

    public ProductResponse toResponse(Product p) {
        return ProductResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .price(p.getPrice())
                .category(p.getCategory())
                .available(p.isAvailable())
                .build();
    }
}