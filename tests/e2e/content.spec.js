/**
 * E2E tests for content features
 */

const { test, expect } = require('@playwright/test');

test.describe('Content Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/installing-unity');
  });

  test('should copy code blocks', async ({ page }) => {
    // Find a code block with copy button
    const codeBlock = page.locator('pre').first();
    
    if (await codeBlock.count() > 0) {
      await codeBlock.hover();
      
      const copyButton = codeBlock.locator('.code-copy-button');
      await expect(copyButton).toBeVisible();
      await expect(copyButton).toHaveText('Copy');
      
      // Click copy button
      await copyButton.click();
      
      // Button should change to "Copied!"
      await expect(copyButton).toHaveText('Copied!');
      await expect(copyButton).toHaveClass(/copied/);
      
      // Wait for it to reset
      await page.waitForTimeout(2100);
      await expect(copyButton).toHaveText('Copy');
    }
  });

  test('should handle smooth scrolling for anchor links', async ({ page }) => {
    // Find an anchor link
    const anchorLink = page.locator('a[href^="#"]').first();
    
    if (await anchorLink.count() > 0) {
      const href = await anchorLink.getAttribute('href');
      const targetId = href.substring(1);
      
      // Click the anchor
      await anchorLink.click();
      
      // Wait for smooth scroll
      await page.waitForTimeout(500);
      
      // Check if target is in viewport
      const target = page.locator(`#${targetId}`);
      if (await target.count() > 0) {
        await expect(target).toBeInViewport();
      }
    }
  });

  test('should mark external links', async ({ page }) => {
    const externalLinks = page.locator('.main-content a[href^="http"]');
    const count = await externalLinks.count();
    
    for (let i = 0; i < count; i++) {
      const link = externalLinks.nth(i);
      const href = await link.getAttribute('href');
      
      if (!href.includes(page.url())) {
        await expect(link).toHaveClass(/external-link/);
        await expect(link).toHaveAttribute('target', '_blank');
        await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      }
    }
  });

  test('should display images with lightbox functionality', async ({ page }) => {
    const image = page.locator('.main-content img').first();
    
    if (await image.count() > 0) {
      // Click image to open lightbox
      await image.click();
      
      // Wait for lightbox to appear
      const lightbox = page.locator('.image-lightbox');
      await expect(lightbox).toBeVisible();
      await expect(lightbox).toHaveClass(/active/);
      
      // Check lightbox image
      const lightboxImg = lightbox.locator('img');
      await expect(lightboxImg).toBeVisible();
      
      // Close lightbox with close button
      const closeButton = lightbox.locator('.lightbox-close');
      await closeButton.click();
      
      // Wait for animation
      await page.waitForTimeout(400);
      
      // Lightbox should be gone
      await expect(lightbox).not.toBeVisible();
    }
  });

  test('should close lightbox on background click', async ({ page }) => {
    const image = page.locator('.main-content img').first();
    
    if (await image.count() > 0) {
      await image.click();
      
      const lightbox = page.locator('.image-lightbox');
      await expect(lightbox).toBeVisible();
      
      // Click on background (not the image)
      await lightbox.click({ position: { x: 10, y: 10 } });
      
      await page.waitForTimeout(400);
      await expect(lightbox).not.toBeVisible();
    }
  });
});

test.describe('Table of Contents', () => {
  test('should highlight current section in TOC', async ({ page }) => {
    await page.goto('/installing-unity');
    
    const toc = page.locator('.toc');
    if (await toc.count() > 0) {
      // Scroll to trigger intersection observer
      await page.evaluate(() => window.scrollTo(0, 200));
      await page.waitForTimeout(100);
      
      const activeLink = toc.locator('a.active');
      const activeCount = await activeLink.count();
      
      if (activeCount > 0) {
        await expect(activeLink).toBeVisible();
      }
    }
  });

  test('should navigate via TOC links', async ({ page }) => {
    await page.goto('/visual-scripting');
    
    const toc = page.locator('.toc');
    if (await toc.count() > 0) {
      const tocLink = toc.locator('a').first();
      
      if (await tocLink.count() > 0) {
        const href = await tocLink.getAttribute('href');
        await tocLink.click();
        
        // Should scroll to the section
        await page.waitForTimeout(500);
        
        if (href && href.startsWith('#')) {
          const targetId = href.substring(1);
          const target = page.locator(`#${targetId}`);
          
          if (await target.count() > 0) {
            await expect(target).toBeInViewport();
          }
        }
      }
    }
  });
});

test.describe('Responsive Design', () => {
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 }
  ];

  viewports.forEach(({ name, width, height }) => {
    test(`should display correctly on ${name}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      
      // Check main layout elements
      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('.main-content')).toBeVisible();
      
      if (width < 768) {
        // Mobile view
        await expect(page.locator('#mobile-menu-toggle')).toBeVisible();
        await expect(page.locator('.sidebar')).not.toHaveClass(/active/);
      } else {
        // Desktop view
        await expect(page.locator('.sidebar')).toBeVisible();
      }
    });
  });
});

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/installing-unity');
    
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1); // Only one h1 per page
    
    // Check heading order
    const headings = await page.evaluate(() => {
      const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      return Array.from(elements).map(el => parseInt(el.tagName[1]));
    });
    
    // Verify no skipped levels
    for (let i = 1; i < headings.length; i++) {
      const diff = headings[i] - headings[i - 1];
      expect(diff).toBeLessThanOrEqual(1);
    }
  });

  test('should have alt text for images', async ({ page }) => {
    await page.goto('/installing-unity');
    
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      await expect(img).toHaveAttribute('alt');
    }
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/');
    
    // Check navigation has proper role
    const nav = page.locator('.sidebar');
    if (await nav.count() > 0) {
      const role = await nav.getAttribute('role');
      if (role) {
        expect(['navigation', 'complementary']).toContain(role);
      }
    }
    
    // Check search has proper labels
    const searchInput = page.locator('#search-input');
    if (await searchInput.count() > 0) {
      const ariaLabel = await searchInput.getAttribute('aria-label');
      const placeholder = await searchInput.getAttribute('placeholder');
      expect(ariaLabel || placeholder).toBeTruthy();
    }
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');
    
    // Tab through elements
    await page.keyboard.press('Tab');
    
    let focusedElement = await page.evaluate(() => document.activeElement.tagName);
    expect(focusedElement).toBeTruthy();
    
    // Continue tabbing
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    focusedElement = await page.evaluate(() => document.activeElement.tagName);
    expect(['A', 'BUTTON', 'INPUT']).toContain(focusedElement);
  });
});