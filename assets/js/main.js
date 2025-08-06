document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function() {
      sidebar.classList.toggle('active');
      sidebarOverlay.classList.toggle('active');
      document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    });
    
    sidebarOverlay.addEventListener('click', function() {
      sidebar.classList.remove('active');
      sidebarOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
  
  // Code copy buttons
  const codeBlocks = document.querySelectorAll('pre');
  codeBlocks.forEach(block => {
    const button = document.createElement('button');
    button.className = 'code-copy-button';
    button.textContent = 'Copy';
    block.appendChild(button);
    
    button.addEventListener('click', function() {
      const code = block.querySelector('code');
      const text = code ? code.textContent : block.textContent;
      
      navigator.clipboard.writeText(text).then(() => {
        button.textContent = 'Copied!';
        button.classList.add('copied');
        setTimeout(() => {
          button.textContent = 'Copy';
          button.classList.remove('copied');
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy:', err);
      });
    });
  });
  
  // Table of contents highlighting
  const tocLinks = document.querySelectorAll('.toc a');
  const headings = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]');
  
  if (tocLinks.length > 0 && headings.length > 0) {
    const observerOptions = {
      rootMargin: '-20% 0px -70% 0px'
    };
    
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute('id');
        const tocLink = document.querySelector(`.toc a[href="#${id}"]`);
        
        if (tocLink) {
          if (entry.isIntersecting) {
            tocLinks.forEach(link => link.classList.remove('active'));
            tocLink.classList.add('active');
          }
        }
      });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    headings.forEach(heading => observer.observe(heading));
  }
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80; // Account for fixed header
        const targetPosition = target.offsetTop - offset;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Add external link indicators
  const externalLinks = document.querySelectorAll('.main-content a[href^="http"]');
  externalLinks.forEach(link => {
    if (!link.hostname.includes(window.location.hostname)) {
      link.classList.add('external-link');
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });
  
  // Image lightbox
  const images = document.querySelectorAll('.main-content img');
  images.forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', function() {
      const lightbox = document.createElement('div');
      lightbox.className = 'image-lightbox';
      lightbox.innerHTML = `
        <div class="lightbox-content">
          <img src="${this.src}" alt="${this.alt}">
          <button class="lightbox-close">&times;</button>
        </div>
      `;
      document.body.appendChild(lightbox);
      document.body.style.overflow = 'hidden';
      
      setTimeout(() => lightbox.classList.add('active'), 10);
      
      const closeBtn = lightbox.querySelector('.lightbox-close');
      const closeLightbox = () => {
        lightbox.classList.remove('active');
        setTimeout(() => {
          document.body.removeChild(lightbox);
          document.body.style.overflow = '';
        }, 300);
      };
      
      closeBtn.addEventListener('click', closeLightbox);
      lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
          closeLightbox();
        }
      });
    });
  });
});