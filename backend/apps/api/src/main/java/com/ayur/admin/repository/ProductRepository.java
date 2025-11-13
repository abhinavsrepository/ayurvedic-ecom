package com.ayur.admin.repository;

import com.ayur.admin.domain.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {

    Optional<Product> findBySku(String sku);

    Optional<Product> findBySlug(String slug);

    boolean existsBySku(String sku);

    boolean existsBySlug(String slug);

    @Query("SELECT p FROM Product p WHERE p.deletedAt IS NULL")
    Page<Product> findAllActive(Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.deletedAt IS NULL " +
           "AND (:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(p.sku) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:status IS NULL OR p.status = :status) " +
           "AND (:category IS NULL OR p.category = :category)")
    Page<Product> searchProducts(
        @Param("search") String search,
        @Param("status") String status,
        @Param("category") String category,
        Pageable pageable
    );

    @Query("SELECT DISTINCT p.category FROM Product p WHERE p.category IS NOT NULL AND p.deletedAt IS NULL")
    List<String> findAllCategories();

    @Query("SELECT p FROM Product p WHERE p.isFeatured = true AND p.deletedAt IS NULL AND p.status = 'ACTIVE'")
    List<Product> findFeaturedProducts();
}
