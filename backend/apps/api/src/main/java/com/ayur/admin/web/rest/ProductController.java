package com.ayur.admin.web.rest;

import com.ayur.admin.service.ProductService;
import com.ayur.admin.service.dto.ProductCreateRequest;
import com.ayur.admin.service.dto.ProductResponse;
import com.ayur.admin.service.dto.ProductUpdateRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/products")
@Tag(name = "Products", description = "Product management endpoints")
@RequiredArgsConstructor
public class ProductController {

  private final ProductService productService;

  @GetMapping
  @Operation(summary = "List products", description = "Get paginated list of products")
  @PreAuthorize("hasAnyRole('ADMIN', 'OPS', 'MARKETING')")
  public ResponseEntity<Page<ProductResponse>> listProducts(
      @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC)
          Pageable pageable,
      @RequestParam(required = false) String search,
      @RequestParam(required = false) String status,
      @RequestParam(required = false) String category) {
    Page<ProductResponse> products =
        productService.listProducts(pageable, search, status, category);
    return ResponseEntity.ok(products);
  }

  @GetMapping("/{productId}")
  @Operation(summary = "Get product", description = "Get product by ID")
  @PreAuthorize("hasAnyRole('ADMIN', 'OPS', 'MARKETING')")
  public ResponseEntity<ProductResponse> getProduct(@PathVariable UUID productId) {
    ProductResponse product = productService.getProduct(productId);
    return ResponseEntity.ok(product);
  }

  @PostMapping
  @Operation(summary = "Create product", description = "Create a new product")
  @PreAuthorize("hasAnyRole('ADMIN', 'OPS')")
  public ResponseEntity<ProductResponse> createProduct(
      @Valid @RequestBody ProductCreateRequest request) {
    ProductResponse product = productService.createProduct(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(product);
  }

  @PutMapping("/{productId}")
  @Operation(summary = "Update product", description = "Update existing product")
  @PreAuthorize("hasAnyRole('ADMIN', 'OPS')")
  public ResponseEntity<ProductResponse> updateProduct(
      @PathVariable UUID productId, @Valid @RequestBody ProductUpdateRequest request) {
    ProductResponse product = productService.updateProduct(productId, request);
    return ResponseEntity.ok(product);
  }

  @DeleteMapping("/{productId}")
  @Operation(summary = "Delete product", description = "Soft delete product")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Void> deleteProduct(@PathVariable UUID productId) {
    productService.deleteProduct(productId);
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/bulk-import")
  @Operation(summary = "Bulk import products", description = "Import products from CSV file")
  @PreAuthorize("hasAnyRole('ADMIN', 'OPS')")
  public ResponseEntity<BulkImportResponse> bulkImport(@RequestParam("file") MultipartFile file) {
    BulkImportResponse response = productService.bulkImportFromCsv(file);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/export/csv")
  @Operation(summary = "Export products", description = "Export products to CSV")
  @PreAuthorize("hasAnyRole('ADMIN', 'OPS', 'MARKETING')")
  public ResponseEntity<byte[]> exportProducts(
      @RequestParam(required = false) String status,
      @RequestParam(required = false) String category) {
    byte[] csv = productService.exportToCsv(status, category);
    return ResponseEntity.ok()
        .header("Content-Disposition", "attachment; filename=products.csv")
        .header("Content-Type", "text/csv")
        .body(csv);
  }

  @PostMapping("/{productId}/media")
  @Operation(
      summary = "Upload product media",
      description = "Get presigned URL for uploading product images")
  @PreAuthorize("hasAnyRole('ADMIN', 'OPS')")
  public ResponseEntity<MediaUploadResponse> getMediaUploadUrl(
      @PathVariable UUID productId,
      @RequestParam String fileName,
      @RequestParam String contentType) {
    MediaUploadResponse response =
        productService.getMediaUploadUrl(productId, fileName, contentType);
    return ResponseEntity.ok(response);
  }

  // Inner DTOs
  public record BulkImportResponse(
      int totalRows, int successCount, int failedCount, String[] errors) {}

  public record MediaUploadResponse(String uploadUrl, String fileUrl, String key) {}
}
