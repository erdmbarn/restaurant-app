package com.aselsan.restaurant.config;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.aselsan.restaurant.enums.MenuCategory;
import com.aselsan.restaurant.model.Product;
import com.aselsan.restaurant.repository.ProductRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;

    public DataInitializer(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        if (productRepository.count() > 0) return; // Zaten varsa ekleme

        List<Product> products = List.of(
            // Corbalar
            build("Mercimek Corbasi", "Gunluk taze mercimek corbasi", 45.00, MenuCategory.SOUP),
            build("Yayla Corbasi", "Yogurtlu pirinc corbasi", 45.00, MenuCategory.SOUP),
            build("Domates Corbasi", "Taze domates ve baharatli", 40.00, MenuCategory.SOUP),
            build("Ezogelin Corbasi", "Kirmizi mercimek ve bulgur", 40.00, MenuCategory.SOUP),

            // Ana Yemek
            build("Izgara Tavuk", "Baharatli izgara tavuk gogsu", 120.00, MenuCategory.MAIN_COURSE),
            build("Kofte", "El yapimi dana koftesi", 130.00, MenuCategory.MAIN_COURSE),
            build("Kuru Fasulye", "Geleneksel kuru fasulye", 90.00, MenuCategory.MAIN_COURSE),
            build("Etli Guvec", "Firin guvec, sebzeli", 150.00, MenuCategory.MAIN_COURSE),
            build("Tavuk Sote", "Sebzeli tavuk sote", 110.00, MenuCategory.MAIN_COURSE),
            build("Bezelye Yemegi", "Zeytinyagli bezelye", 80.00, MenuCategory.MAIN_COURSE),

            // Yan Yemek
            build("Pilav", "Tereyagli pirinc pilavi", 35.00, MenuCategory.SIDE_DISH),
            build("Makarna", "Domates soslu makarna", 35.00, MenuCategory.SIDE_DISH),
            build("Patates Kizartmasi", "Cripsy patates", 40.00, MenuCategory.SIDE_DISH),
            build("Bulgur Pilavi", "Domatesli bulgur pilavi", 30.00, MenuCategory.SIDE_DISH),

            // Salata
            build("Coban Salatasi", "Domates, salatalik, sogan", 50.00, MenuCategory.SALAD),
            build("Mevsim Salatasi", "Taze mevsim yesilikleri", 55.00, MenuCategory.SALAD),
            build("Roka Salatasi", "Roka, parmesan, limon", 60.00, MenuCategory.SALAD),

            // Tatli
            build("Sutlac", "Firinda sutlac", 55.00, MenuCategory.DESSERT),
            build("Baklava", "Antep fistikli baklava", 80.00, MenuCategory.DESSERT),
            build("Kazandibi", "Geleneksel kazandibi", 55.00, MenuCategory.DESSERT),
            build("Asure", "Geleneksel asure", 45.00, MenuCategory.DESSERT),

            // Icecek
            build("Su", "500ml sise su", 15.00, MenuCategory.BEVERAGE),
            build("Ayran", "Soguk ayran", 20.00, MenuCategory.BEVERAGE),
            build("Kola", "330ml kola", 35.00, MenuCategory.BEVERAGE),
            build("Cay", "Taze demlenmis cay", 15.00, MenuCategory.BEVERAGE),
            build("Meyve Suyu", "Taze sikma meyve suyu", 40.00, MenuCategory.BEVERAGE)
        );

        productRepository.saveAll(products);
        System.out.println("Default products loaded: " + products.size() + " items");
    }

    private Product build(String name, String description, double price, MenuCategory category) {
        return Product.builder()
                .name(name)
                .description(description)
                .price(BigDecimal.valueOf(price))
                .category(category)
                .available(true)
                .build();
    }
}