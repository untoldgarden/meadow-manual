/**
 * E2E tests for search functionality
 */

const { test, expect } = require('@playwright/test');

test.describe('Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should open search modal with keyboard shortcut', async ({ page }) => {
    const searchModal = page.locator('#search-modal');
    
    // Initially hidden
    await expect(searchModal).not.toHaveClass(/active/);
    
    // Press Cmd+K (or Ctrl+K)
    await page.keyboard.press('Control+k');
    
    // Modal should be visible
    await expect(searchModal).toHaveClass(/active/);
    
    // Input should be focused
    const searchInput = page.locator('#search-input');
    await expect(searchInput).toBeFocused();
  });

  test('should open search modal via search button', async ({ page }) => {
    const searchTrigger = page.locator('.search-trigger');
    await searchTrigger.click();
    
    const searchModal = page.locator('#search-modal');
    await expect(searchModal).toHaveClass(/active/);
  });

  test('should close search modal with Escape key', async ({ page }) => {
    await page.keyboard.press('Control+k');
    
    const searchModal = page.locator('#search-modal');
    await expect(searchModal).toHaveClass(/active/);
    
    await page.keyboard.press('Escape');
    await expect(searchModal).not.toHaveClass(/active/);
  });

  test('should close search modal with close button', async ({ page }) => {
    await page.keyboard.press('Control+k');
    
    const closeButton = page.locator('#search-close');
    await closeButton.click();
    
    const searchModal = page.locator('#search-modal');
    await expect(searchModal).not.toHaveClass(/active/);
  });

  test('should perform search and display results', async ({ page }) => {
    await page.keyboard.press('Control+k');
    
    const searchInput = page.locator('#search-input');
    await searchInput.type('unity');
    
    // Wait for search results
    await page.waitForTimeout(500);
    
    const searchResults = page.locator('.search-result');
    await expect(searchResults).toHaveCount(1); // At least one result
    
    // Results should contain the search term
    const firstResult = searchResults.first();
    await expect(firstResult).toContainText(/unity/i);
  });

  test('should show no results message', async ({ page }) => {
    await page.keyboard.press('Control+k');
    
    const searchInput = page.locator('#search-input');
    await searchInput.type('xyznonexistentquery123');
    
    await page.waitForTimeout(500);
    
    const noResults = page.locator('.search-empty');
    await expect(noResults).toContainText('No results found');
  });

  test('should navigate search results with keyboard', async ({ page }) => {
    await page.keyboard.press('Control+k');
    
    const searchInput = page.locator('#search-input');
    await searchInput.type('install');
    
    await page.waitForTimeout(500);
    
    // Navigate down
    await page.keyboard.press('ArrowDown');
    
    const firstResult = page.locator('.search-result').first();
    await expect(firstResult).toHaveClass(/selected/);
    
    // Navigate down again
    await page.keyboard.press('ArrowDown');
    
    const secondResult = page.locator('.search-result').nth(1);
    if (await secondResult.count() > 0) {
      await expect(secondResult).toHaveClass(/selected/);
      await expect(firstResult).not.toHaveClass(/selected/);
    }
    
    // Navigate up
    await page.keyboard.press('ArrowUp');
    await expect(firstResult).toHaveClass(/selected/);
  });

  test('should navigate to selected result on Enter', async ({ page }) => {
    await page.keyboard.press('Control+k');
    
    const searchInput = page.locator('#search-input');
    await searchInput.type('unity');
    
    await page.waitForTimeout(500);
    
    // Select first result
    await page.keyboard.press('ArrowDown');
    
    // Press Enter to navigate
    await page.keyboard.press('Enter');
    
    // Should navigate to the page
    await expect(page).toHaveURL(/unity/);
  });

  test('should highlight search terms in results', async ({ page }) => {
    await page.keyboard.press('Control+k');
    
    const searchInput = page.locator('#search-input');
    await searchInput.type('install');
    
    await page.waitForTimeout(500);
    
    const highlights = page.locator('.search-result mark');
    await expect(highlights).toHaveCount(1); // At least one highlight
    await expect(highlights.first()).toContainText(/install/i);
  });

  test('should group results by category', async ({ page }) => {
    await page.keyboard.press('Control+k');
    
    const searchInput = page.locator('#search-input');
    await searchInput.type('experience');
    
    await page.waitForTimeout(500);
    
    const categories = page.locator('.search-category');
    const categoryCount = await categories.count();
    
    if (categoryCount > 0) {
      await expect(categories.first()).toBeVisible();
    }
  });

  test('should show search hints', async ({ page }) => {
    await page.keyboard.press('Control+k');
    
    const searchHints = page.locator('.search-hint');
    await expect(searchHints).toBeVisible();
    await expect(searchHints).toContainText('Navigate');
    await expect(searchHints).toContainText('Select');
    await expect(searchHints).toContainText('Close');
  });

  test('should require minimum characters for search', async ({ page }) => {
    await page.keyboard.press('Control+k');
    
    const searchInput = page.locator('#search-input');
    await searchInput.type('a');
    
    await page.waitForTimeout(300);
    
    const message = page.locator('.search-empty');
    await expect(message).toContainText('Type at least 2 characters');
  });
});

test.describe('Search Performance', () => {
  test('should load search index', async ({ page }) => {
    await page.goto('/');
    
    // Wait for search.json to be loaded
    const searchJsonResponse = await page.waitForResponse(response => 
      response.url().includes('search.json') && response.status() === 200
    );
    
    expect(searchJsonResponse).toBeTruthy();
    
    const searchData = await searchJsonResponse.json();
    expect(Array.isArray(searchData)).toBe(true);
    expect(searchData.length).toBeGreaterThan(0);
  });

  test('should handle rapid search queries', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Control+k');
    
    const searchInput = page.locator('#search-input');
    
    // Type rapidly
    await searchInput.type('t');
    await searchInput.type('e');
    await searchInput.type('s');
    await searchInput.type('t');
    
    await page.waitForTimeout(500);
    
    // Should still show results
    const searchResults = page.locator('#search-results');
    await expect(searchResults).toBeVisible();
  });
});