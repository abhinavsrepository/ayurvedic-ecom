package com.ayur.admin.repository;

import com.ayur.admin.domain.Stock;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface StockRepository extends JpaRepository<Stock, UUID> {

  Optional<Stock> findBySku(String sku);

  @Query("SELECT s FROM Stock s WHERE s.quantity <= s.lowStockThreshold")
  List<Stock> findLowStock();

  @Query("SELECT s FROM Stock s WHERE s.product.id = :productId")
  Optional<Stock> findByProductId(UUID productId);
}
