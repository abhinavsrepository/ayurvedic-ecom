package com.ayur.admin.service;

import com.ayur.admin.domain.Product;
import com.ayur.admin.repository.ProductRepository;
import com.ayur.admin.service.dto.ProductCreateRequest;
import com.ayur.admin.service.dto.ProductResponse;
import com.ayur.admin.service.dto.ProductUpdateRequest;
import com.ayur.admin.web.rest.ProductController;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public Page<ProductResponse> listProducts(Pageable pageable, String search, String status, String category) {
        Page<Product> products = productRepository.searchProducts(search, status, category, pageable);
        return products.map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public ProductResponse getProduct(UUID productId) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        return mapToResponse(product);
    }

    @Transactional
    public ProductResponse createProduct(ProductCreateRequest request) {
        if (productRepository.existsBySku(request.getSku())) {
            throw new IllegalArgumentException("Product with SKU already exists");
        }
        if (productRepository.existsBySlug(request.getSlug())) {
            throw new IllegalArgumentException("Product with slug already exists");
        }

        Product product = Product.builder()
            .sku(request.getSku())
            .name(request.getName())
            .slug(request.getSlug())
            .description(request.getDescription())
            .shortDescription(request.getShortDescription())
            .price(request.getPrice())
            .compareAtPrice(request.getCompareAtPrice())
            .costPrice(request.getCostPrice())
            .status(Product.ProductStatus.valueOf(request.getStatus()))
            .category(request.getCategory())
            .brand(request.getBrand())
            .weightGrams(request.getWeightGrams())
            .isFeatured(request.getIsFeatured())
            .seoTitle(request.getSeoTitle())
            .seoDescription(request.getSeoDescription())
            .build();

        product = productRepository.save(product);
        log.info("Created product: {}", product.getSku());
        return mapToResponse(product);
    }

    @Transactional
    public ProductResponse updateProduct(UUID productId, ProductUpdateRequest request) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        if (request.getName() != null) product.setName(request.getName());
        if (request.getDescription() != null) product.setDescription(request.getDescription());
        if (request.getShortDescription() != null) product.setShortDescription(request.getShortDescription());
        if (request.getPrice() != null) product.setPrice(request.getPrice());
        if (request.getCompareAtPrice() != null) product.setCompareAtPrice(request.getCompareAtPrice());
        if (request.getCostPrice() != null) product.setCostPrice(request.getCostPrice());
        if (request.getStatus() != null) product.setStatus(Product.ProductStatus.valueOf(request.getStatus()));
        if (request.getCategory() != null) product.setCategory(request.getCategory());
        if (request.getBrand() != null) product.setBrand(request.getBrand());
        if (request.getWeightGrams() != null) product.setWeightGrams(request.getWeightGrams());
        if (request.getIsFeatured() != null) product.setIsFeatured(request.getIsFeatured());

        product = productRepository.save(product);
        log.info("Updated product: {}", product.getSku());
        return mapToResponse(product);
    }

    @Transactional
    public void deleteProduct(UUID productId) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        product.setDeletedAt(Instant.now());
        productRepository.save(product);
        log.info("Deleted product: {}", product.getSku());
    }

    public ProductController.BulkImportResponse bulkImportFromCsv(MultipartFile file) {
        // TODO: Implement CSV import
        return new ProductController.BulkImportResponse(0, 0, 0, new String[]{});
    }

    public byte[] exportToCsv(String status, String category) {
        // TODO: Implement CSV export
        return new byte[0];
    }

    public ProductController.MediaUploadResponse getMediaUploadUrl(UUID productId, String fileName, String contentType) {
        // TODO: Implement S3 presigned URL generation
        return new ProductController.MediaUploadResponse("", "", "");
    }

    private ProductResponse mapToResponse(Product product) {
        return ProductResponse.builder()
            .id(product.getId())
            .sku(product.getSku())
            .name(product.getName())
            .slug(product.getSlug())
            .description(product.getDescription())
            .shortDescription(product.getShortDescription())
            .price(product.getPrice())
            .compareAtPrice(product.getCompareAtPrice())
            .costPrice(product.getCostPrice())
            .status(product.getStatus().name())
            .category(product.getCategory())
            .brand(product.getBrand())
            .weightGrams(product.getWeightGrams())
            .isFeatured(product.getIsFeatured())
            .seoTitle(product.getSeoTitle())
            .seoDescription(product.getSeoDescription())
            .createdAt(product.getCreatedAt())
            .updatedAt(product.getUpdatedAt())
            .build();
    }
}
