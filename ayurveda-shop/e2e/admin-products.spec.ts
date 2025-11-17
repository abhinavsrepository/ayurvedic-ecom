import { test, expect } from '@playwright/test';

// Helper function to login
async function loginAsAdmin(page: any) {
  await page.goto('/admin/login');
  await page.fill('input[type="email"]', 'admin@ayurveda.com');
  await page.fill('input[type="password"]', 'Test@1234');
  await page.click('button[type="submit"]');
  await page.waitForURL('/admin');
}

test.describe('Admin Products', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/products');
  });

  test('should display products list', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Products');
    await expect(page.locator('table')).toBeVisible();
  });

  test('should search for products', async ({ page }) => {
    const searchInput = page.locator('input[type="search"]');
    await searchInput.fill('Ashwagandha');

    // Wait for results to filter
    await page.waitForTimeout(500);

    // Should show only matching products
    await expect(page.locator('table tbody tr').first()).toContainText('Ashwagandha');
  });

  test('should open create product dialog', async ({ page }) => {
    await page.click('button:has-text("Add Product")');

    await expect(page.locator('text=Create New Product')).toBeVisible();
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="sku"]')).toBeVisible();
  });

  test('should create a new product', async ({ page }) => {
    await page.click('button:has-text("Add Product")');

    // Fill in product details
    await page.fill('input[name="name"]', 'Test Product');
    await page.fill('input[name="sku"]', 'TEST-001');
    await page.fill('textarea[name="description"]', 'This is a test product');
    await page.fill('input[name="price"]', '999');
    await page.fill('input[name="stock"]', '50');

    // Submit form
    await page.click('button[type="submit"]:has-text("Create")');

    // Should show success message
    await expect(page.locator('text=Product created successfully')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.click('button:has-text("Add Product")');
    await page.click('button[type="submit"]:has-text("Create")');

    // Should show validation errors
    await expect(page.locator('text=Name is required')).toBeVisible();
    await expect(page.locator('text=SKU is required')).toBeVisible();
  });

  test('should filter products by category', async ({ page }) => {
    // Assuming you have a category filter
    await page.click('select[name="category"]');
    await page.selectOption('select[name="category"]', 'Supplements');

    // Wait for filter to apply
    await page.waitForTimeout(500);

    // All visible products should be from Supplements category
    const products = await page.locator('table tbody tr').all();
    for (const product of products) {
      await expect(product).toContainText('Supplements');
    }
  });

  test('should export products to CSV', async ({ page }) => {
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('button:has-text("Export")'),
    ]);

    expect(download.suggestedFilename()).toContain('.csv');
  });
});
