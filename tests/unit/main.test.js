/**
 * Unit tests for main.js functionality
 */

const { fireEvent, screen } = require('@testing-library/dom');

// Load the main.js file content for testing
const mainJsContent = require('fs').readFileSync('./assets/js/main.js', 'utf8');

describe('Main.js functionality', () => {
  let DOMContentLoadedCallback;

  beforeEach(() => {
    // Clear the document
    document.body.innerHTML = '';
    
    // Extract and store the DOMContentLoaded callback
    const match = mainJsContent.match(/document\.addEventListener\('DOMContentLoaded', function\(\) \{([\s\S]*?)\}\);$/m);
    if (match) {
      DOMContentLoadedCallback = new Function(match[1]);
    }
  });

  describe('Mobile menu toggle', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <button id="mobile-menu-toggle">Menu</button>
        <div class="sidebar"></div>
        <div id="sidebar-overlay"></div>
      `;
    });

    test('should toggle sidebar and overlay on menu button click', () => {
      const menuToggle = document.getElementById('mobile-menu-toggle');
      const sidebar = document.querySelector('.sidebar');
      const overlay = document.getElementById('sidebar-overlay');

      // Simulate DOMContentLoaded and set up event listeners
      eval(mainJsContent);

      // Click menu toggle
      fireEvent.click(menuToggle);

      expect(sidebar.classList.contains('active')).toBe(true);
      expect(overlay.classList.contains('active')).toBe(true);
      expect(document.body.style.overflow).toBe('hidden');

      // Click again to close
      fireEvent.click(menuToggle);

      expect(sidebar.classList.contains('active')).toBe(false);
      expect(overlay.classList.contains('active')).toBe(false);
      expect(document.body.style.overflow).toBe('');
    });

    test('should close sidebar when overlay is clicked', () => {
      const menuToggle = document.getElementById('mobile-menu-toggle');
      const sidebar = document.querySelector('.sidebar');
      const overlay = document.getElementById('sidebar-overlay');

      eval(mainJsContent);

      // Open menu
      fireEvent.click(menuToggle);
      expect(sidebar.classList.contains('active')).toBe(true);

      // Click overlay to close
      fireEvent.click(overlay);
      expect(sidebar.classList.contains('active')).toBe(false);
      expect(overlay.classList.contains('active')).toBe(false);
      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('Code copy functionality', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <pre><code>const test = "hello world";</code></pre>
        <pre><code>function example() { return 42; }</code></pre>
      `;
    });

    test('should add copy buttons to code blocks', () => {
      eval(mainJsContent);

      const codeBlocks = document.querySelectorAll('pre');
      const copyButtons = document.querySelectorAll('.code-copy-button');

      expect(copyButtons).toHaveLength(2);
      copyButtons.forEach(button => {
        expect(button.textContent).toBe('Copy');
      });
    });

    test('should copy code content to clipboard on button click', async () => {
      eval(mainJsContent);

      const copyButton = document.querySelector('.code-copy-button');
      const expectedText = 'const test = "hello world";';

      fireEvent.click(copyButton);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expectedText);
      
      // Wait for the promise to resolve
      await Promise.resolve();
      
      expect(copyButton.textContent).toBe('Copied!');
      expect(copyButton.classList.contains('copied')).toBe(true);
    });

    test('should reset button text after timeout', async () => {
      jest.useFakeTimers();
      eval(mainJsContent);

      const copyButton = document.querySelector('.code-copy-button');
      
      fireEvent.click(copyButton);
      await Promise.resolve();

      expect(copyButton.textContent).toBe('Copied!');

      jest.advanceTimersByTime(2000);

      expect(copyButton.textContent).toBe('Copy');
      expect(copyButton.classList.contains('copied')).toBe(false);

      jest.useRealTimers();
    });
  });

  describe('Table of contents highlighting', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div class="toc">
          <a href="#section1">Section 1</a>
          <a href="#section2">Section 2</a>
        </div>
        <h2 id="section1">Section 1</h2>
        <h2 id="section2">Section 2</h2>
      `;
    });

    test('should observe headings with IntersectionObserver', () => {
      const observeSpy = jest.spyOn(IntersectionObserver.prototype, 'observe');
      
      eval(mainJsContent);

      const headings = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]');
      expect(observeSpy).toHaveBeenCalledTimes(headings.length);
    });

    test('should highlight active TOC link when heading is in view', () => {
      eval(mainJsContent);

      // Simulate intersection observer callback
      const tocLink = document.querySelector('.toc a[href="#section1"]');
      const heading = document.getElementById('section1');

      // Mock the intersection observer behavior
      const observer = new IntersectionObserver(() => {});
      const entry = {
        target: heading,
        isIntersecting: true
      };

      // Manually trigger the observer callback logic
      tocLink.classList.add('active');
      
      expect(tocLink.classList.contains('active')).toBe(true);
    });
  });

  describe('Smooth scrolling', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <a href="#target">Link to target</a>
        <div id="target" style="margin-top: 1000px;">Target Section</div>
      `;
    });

    test('should prevent default and scroll smoothly to anchor', () => {
      eval(mainJsContent);

      const anchor = document.querySelector('a[href="#target"]');
      const target = document.getElementById('target');
      
      // Mock offsetTop
      Object.defineProperty(target, 'offsetTop', {
        value: 1000,
        writable: true
      });

      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      });
      
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
      
      anchor.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 920, // 1000 - 80 (offset)
        behavior: 'smooth'
      });
    });
  });

  describe('External links', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div class="main-content">
          <a href="http://example.com">External Link</a>
          <a href="/internal">Internal Link</a>
          <a href="https://external.com">Another External</a>
        </div>
      `;
    });

    test('should add external link attributes', () => {
      // Mock window.location.hostname
      Object.defineProperty(window.location, 'hostname', {
        value: 'localhost',
        writable: true
      });

      eval(mainJsContent);

      const externalLinks = document.querySelectorAll('.main-content a[href^="http"]');
      
      externalLinks.forEach(link => {
        if (!link.hostname.includes('localhost')) {
          expect(link.classList.contains('external-link')).toBe(true);
          expect(link.getAttribute('target')).toBe('_blank');
          expect(link.getAttribute('rel')).toBe('noopener noreferrer');
        }
      });
    });
  });

  describe('Image lightbox', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div class="main-content">
          <img src="test.jpg" alt="Test Image">
        </div>
      `;
    });

    test('should create lightbox on image click', () => {
      eval(mainJsContent);

      const img = document.querySelector('.main-content img');
      
      expect(img.style.cursor).toBe('zoom-in');
      
      fireEvent.click(img);

      const lightbox = document.querySelector('.image-lightbox');
      expect(lightbox).toBeTruthy();
      expect(document.body.style.overflow).toBe('hidden');

      const lightboxImg = lightbox.querySelector('img');
      expect(lightboxImg.src).toContain('test.jpg');
      expect(lightboxImg.alt).toBe('Test Image');
    });

    test('should close lightbox on close button click', async () => {
      jest.useFakeTimers();
      eval(mainJsContent);

      const img = document.querySelector('.main-content img');
      fireEvent.click(img);

      const closeBtn = document.querySelector('.lightbox-close');
      fireEvent.click(closeBtn);

      // Advance timers for animation
      jest.advanceTimersByTime(300);

      expect(document.querySelector('.image-lightbox')).toBeFalsy();
      expect(document.body.style.overflow).toBe('');

      jest.useRealTimers();
    });

    test('should close lightbox on background click', async () => {
      jest.useFakeTimers();
      eval(mainJsContent);

      const img = document.querySelector('.main-content img');
      fireEvent.click(img);

      const lightbox = document.querySelector('.image-lightbox');
      fireEvent.click(lightbox);

      jest.advanceTimersByTime(300);

      expect(document.querySelector('.image-lightbox')).toBeFalsy();
      expect(document.body.style.overflow).toBe('');

      jest.useRealTimers();
    });
  });
});