/**
 * E2E tests for site navigation
 */

const { test, expect } = require('@playwright/test');

test.describe('Site Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load homepage', async ({ page }) => {
    await expect(page).toHaveTitle(/Meadow Manual/);
    await expect(page.locator('h1')).toContainText('Meadow Manual');
  });

  test('should navigate to Getting Started section', async ({ page }) => {
    await page.click('text=Getting Started');
    await page.click('text=Installing Unity');
    await expect(page).toHaveURL(/installing-unity/);
    await expect(page.locator('h1')).toContainText('Installing Unity');
  });

  test('should navigate using breadcrumbs', async ({ page }) => {
    await page.goto('/installing-unity');
    
    const breadcrumbs = page.locator('.breadcrumbs');
    await expect(breadcrumbs).toBeVisible();
    
    await breadcrumbs.locator('a', { hasText: 'Home' }).click();
    await expect(page).toHaveURL('/');
  });

  test('should navigate between pages using next/prev links', async ({ page }) => {
    await page.goto('/installing-unity');
    
    const pageNav = page.locator('.page-nav');
    if (await pageNav.isVisible()) {
      const nextLink = pageNav.locator('a').filter({ hasText: 'Next' });
      if (await nextLink.count() > 0) {
        await nextLink.click();
        await expect(page).not.toHaveURL(/installing-unity/);
      }
    }
  });

  test('should handle 404 pages', async ({ page }) => {
    await page.goto('/non-existent-page');
    await expect(page.locator('text=404')).toBeVisible();
  });
});

test.describe('Mobile Navigation', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should toggle mobile menu', async ({ page }) => {
    await page.goto('/');
    
    const sidebar = page.locator('.sidebar');
    const menuToggle = page.locator('#mobile-menu-toggle');
    const overlay = page.locator('#sidebar-overlay');

    // Initially hidden
    await expect(sidebar).not.toHaveClass(/active/);

    // Open menu
    await menuToggle.click();
    await expect(sidebar).toHaveClass(/active/);
    await expect(overlay).toHaveClass(/active/);

    // Close menu via overlay
    await overlay.click();
    await expect(sidebar).not.toHaveClass(/active/);
  });

  test('should navigate on mobile', async ({ page }) => {
    await page.goto('/');
    
    const menuToggle = page.locator('#mobile-menu-toggle');
    await menuToggle.click();

    await page.click('text=Getting Started');
    await page.click('text=Installing Unity');
    
    await expect(page).toHaveURL(/installing-unity/);
    await expect(page.locator('.sidebar')).not.toHaveClass(/active/);
  });
});

test.describe('Sidebar Navigation', () => {
  test('should highlight current page in sidebar', async ({ page }) => {
    await page.goto('/installing-unity');
    
    const activeLink = page.locator('.sidebar a.active');
    await expect(activeLink).toContainText('Installing Unity');
  });

  test('should expand/collapse sidebar sections', async ({ page }) => {
    await page.goto('/');
    
    const gettingStarted = page.locator('.sidebar').locator('text=Getting Started');
    await expect(gettingStarted).toBeVisible();
    
    // Check if subsections are visible
    const unityLink = page.locator('.sidebar').locator('text=Installing Unity');
    await expect(unityLink).toBeVisible();
  });

  test('should maintain sidebar state during navigation', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to a page
    await page.click('.sidebar >> text=Installing Unity');
    await expect(page).toHaveURL(/installing-unity/);
    
    // Sidebar should still be visible on desktop
    const sidebar = page.locator('.sidebar');
    await expect(sidebar).toBeVisible();
  });
});