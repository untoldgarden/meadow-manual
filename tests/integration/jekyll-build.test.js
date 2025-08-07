/**
 * Integration tests for Jekyll build process
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const execAsync = promisify(exec);
const fsExists = promisify(fs.exists);
const fsReadFile = promisify(fs.readFile);
const fsReaddir = promisify(fs.readdir);

describe('Jekyll Build Integration Tests', () => {
  const siteDir = path.join(__dirname, '../../_site');
  
  beforeAll(async () => {
    // Build the Jekyll site
    try {
      await execAsync('bundle exec jekyll build', {
        cwd: path.join(__dirname, '../..')
      });
    } catch (error) {
      console.error('Jekyll build failed:', error);
      throw error;
    }
  }, 60000); // 60 second timeout for build

  describe('Build output', () => {
    test('should create _site directory', async () => {
      const exists = await fsExists(siteDir);
      expect(exists).toBe(true);
    });

    test('should generate index.html', async () => {
      const indexPath = path.join(siteDir, 'index.html');
      const exists = await fsExists(indexPath);
      expect(exists).toBe(true);
    });

    test('should include required assets', async () => {
      const assetsToCheck = [
        'assets/css/main.css',
        'assets/css/components.css',
        'assets/css/search.css',
        'assets/js/main.js',
        'assets/js/search.js',
        'assets/js/lunr.min.js'
      ];

      for (const asset of assetsToCheck) {
        const assetPath = path.join(siteDir, asset);
        const exists = await fsExists(assetPath);
        expect(exists).toBe(true);
      }
    });

    test('should generate search.json', async () => {
      const searchJsonPath = path.join(siteDir, 'search.json');
      const exists = await fsExists(searchJsonPath);
      expect(exists).toBe(true);

      // Verify it's valid JSON
      const content = await fsReadFile(searchJsonPath, 'utf8');
      expect(() => JSON.parse(content)).not.toThrow();
      
      const searchData = JSON.parse(content);
      expect(Array.isArray(searchData)).toBe(true);
      expect(searchData.length).toBeGreaterThan(0);
    });

    test('should copy images directory', async () => {
      const imagesDir = path.join(siteDir, 'images');
      const exists = await fsExists(imagesDir);
      expect(exists).toBe(true);

      const images = await fsReaddir(imagesDir);
      expect(images.length).toBeGreaterThan(0);
    });

    test('should generate 404 page', async () => {
      const notFoundPath = path.join(siteDir, '404.html');
      const exists = await fsExists(notFoundPath);
      expect(exists).toBe(true);
    });

    test('should include favicon', async () => {
      const faviconPath = path.join(siteDir, 'favicon.ico');
      const exists = await fsExists(faviconPath);
      expect(exists).toBe(true);
    });
  });

  describe('Page generation', () => {
    test('should generate all markdown pages as HTML', async () => {
      const pagesToCheck = [
        'installing-unity/index.html',
        'create-your-first-experience/index.html',
        'visual-scripting/index.html',
        'dialogue-system/index.html',
        'image-tracking/index.html',
        'map-marker/index.html',
        'touch-interaction/index.html',
        'animations/index.html',
        'vibrations/index.html'
      ];

      for (const page of pagesToCheck) {
        const pagePath = path.join(siteDir, page);
        const exists = await fsExists(pagePath);
        expect(exists).toBe(true);
      }
    });

    test('should apply default layout to pages', async () => {
      const indexPath = path.join(siteDir, 'index.html');
      const content = await fsReadFile(indexPath, 'utf8');

      // Check for layout elements
      expect(content).toContain('<!DOCTYPE html>');
      expect(content).toContain('<header');
      expect(content).toContain('class="sidebar"');
      expect(content).toContain('class="main-content"');
    });

    test('should include header and navigation', async () => {
      const indexPath = path.join(siteDir, 'index.html');
      const content = await fsReadFile(indexPath, 'utf8');

      expect(content).toContain('id="mobile-menu-toggle"');
      expect(content).toContain('class="search-trigger"');
    });

    test('should process includes correctly', async () => {
      const pagePath = path.join(siteDir, 'installing-unity/index.html');
      const content = await fsReadFile(pagePath, 'utf8');

      // Check for breadcrumbs include
      expect(content).toContain('class="breadcrumbs"');
      
      // Check for page navigation include
      expect(content).toContain('class="page-nav"');
    });
  });

  describe('Content processing', () => {
    test('should convert markdown to HTML', async () => {
      const pagePath = path.join(siteDir, 'installing-unity/index.html');
      const content = await fsReadFile(pagePath, 'utf8');

      // Check for HTML elements that would be generated from markdown
      expect(content).toMatch(/<h[1-6]/);
      expect(content).toMatch(/<p>/);
    });

    test('should process liquid templates', async () => {
      const indexPath = path.join(siteDir, 'index.html');
      const content = await fsReadFile(indexPath, 'utf8');

      // Should not contain raw liquid tags
      expect(content).not.toContain('{{');
      expect(content).not.toContain('{%');
    });

    test('should handle image paths correctly', async () => {
      const pagePath = path.join(siteDir, 'installing-unity/index.html');
      const content = await fsReadFile(pagePath, 'utf8');

      // Check if images are referenced with correct paths
      if (content.includes('<img')) {
        expect(content).toMatch(/src="[^"]+\.(webp|jpg|png)"/);
      }
    });
  });

  describe('Search functionality setup', () => {
    test('should include search modal HTML', async () => {
      const indexPath = path.join(siteDir, 'index.html');
      const content = await fsReadFile(indexPath, 'utf8');

      // Search functionality should be initialized via JavaScript
      expect(content).toContain('search.js');
      expect(content).toContain('lunr.min.js');
    });

    test('should generate valid search index data', async () => {
      const searchJsonPath = path.join(siteDir, 'search.json');
      const content = await fsReadFile(searchJsonPath, 'utf8');
      const searchData = JSON.parse(content);

      // Verify search data structure
      searchData.forEach(item => {
        expect(item).toHaveProperty('title');
        expect(item).toHaveProperty('content');
        expect(item).toHaveProperty('url');
        expect(item).toHaveProperty('category');
      });
    });
  });

  describe('Asset optimization', () => {
    test('should include minified lunr.js', async () => {
      const lunrPath = path.join(siteDir, 'assets/js/lunr.min.js');
      const content = await fsReadFile(lunrPath, 'utf8');
      
      // Check if it's minified (no excessive whitespace)
      const lines = content.split('\n');
      expect(lines.length).toBeLessThan(50); // Minified files have fewer lines
    });

    test('should include all CSS files', async () => {
      const cssFiles = ['main.css', 'components.css', 'search.css'];
      
      for (const cssFile of cssFiles) {
        const cssPath = path.join(siteDir, 'assets/css', cssFile);
        const exists = await fsExists(cssPath);
        expect(exists).toBe(true);
        
        const content = await fsReadFile(cssPath, 'utf8');
        expect(content.length).toBeGreaterThan(100); // Has actual content
      }
    });
  });

  describe('Configuration', () => {
    test('should respect _config.yml settings', async () => {
      const indexPath = path.join(siteDir, 'index.html');
      const content = await fsReadFile(indexPath, 'utf8');

      // Check if site title from config is present
      expect(content).toContain('Meadow Manual');
    });

    test('should include CNAME file for GitHub Pages', async () => {
      const cnamePath = path.join(siteDir, 'CNAME');
      const exists = await fsExists(cnamePath);
      expect(exists).toBe(true);
    });
  });

  describe('Performance and accessibility', () => {
    test('should include viewport meta tag', async () => {
      const indexPath = path.join(siteDir, 'index.html');
      const content = await fsReadFile(indexPath, 'utf8');

      expect(content).toContain('viewport');
      expect(content).toContain('width=device-width');
    });

    test('should include proper charset', async () => {
      const indexPath = path.join(siteDir, 'index.html');
      const content = await fsReadFile(indexPath, 'utf8');

      expect(content).toContain('charset="utf-8"');
    });

    test('should include alt text for images', async () => {
      const pagePath = path.join(siteDir, 'installing-unity/index.html');
      const content = await fsReadFile(pagePath, 'utf8');

      if (content.includes('<img')) {
        const imgTags = content.match(/<img[^>]+>/g) || [];
        imgTags.forEach(tag => {
          expect(tag).toContain('alt=');
        });
      }
    });
  });
});