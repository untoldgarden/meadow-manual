// Preserve sidebar state without layout shifts - immediate execution
(function() {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;
  
  // Add no-transitions class immediately to prevent any animations during load
  sidebar.classList.add('sidebar-no-transitions');
  
  // Function to restore sidebar state
  function restoreSidebarState() {
    const groupHeaders = document.querySelectorAll('.sidebar-group-header');
    
    groupHeaders.forEach(header => {
      const targetId = header.getAttribute('data-toggle');
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const isCurrentPageInGroup = targetElement.querySelector('a.active');
        
        if (isCurrentPageInGroup) {
          // Always expand group with active page
          header.classList.add('expanded');
          targetElement.classList.add('expanded');
          sessionStorage.setItem(`sidebar-${targetId}`, 'expanded');
        } else {
          // Auto-collapse groups without active page
          header.classList.remove('expanded');
          targetElement.classList.remove('expanded');
          sessionStorage.removeItem(`sidebar-${targetId}`);
        }
      }
    });
    
    // Restore scroll position
    const savedScrollTop = sessionStorage.getItem('sidebarScrollTop');
    if (savedScrollTop !== null) {
      sidebar.scrollTop = parseInt(savedScrollTop, 10);
    }
  }
  
  // Try to restore immediately if elements are available
  if (document.querySelectorAll('.sidebar-group-header').length > 0) {
    restoreSidebarState();
  } else {
    // Wait for DOM if elements aren't ready yet
    document.addEventListener('DOMContentLoaded', restoreSidebarState);
  }
  
  // Remove no-transitions class after a brief delay to re-enable animations
  setTimeout(() => {
    sidebar.classList.remove('sidebar-no-transitions');
  }, 100);
})();

document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  
  // Preserve sidebar scroll position
  function preserveSidebarScroll() {
    if (sidebar) {
      // Save scroll position on navigation
      const sidebarLinks = sidebar.querySelectorAll('a');
      sidebarLinks.forEach(link => {
        link.addEventListener('click', function() {
          sessionStorage.setItem('sidebarScrollTop', sidebar.scrollTop);
        });
      });
      
      // Also save on page unload
      window.addEventListener('beforeunload', function() {
        sessionStorage.setItem('sidebarScrollTop', sidebar.scrollTop);
      });
      
      // Save scroll position periodically while scrolling
      let scrollTimeout;
      sidebar.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
          sessionStorage.setItem('sidebarScrollTop', sidebar.scrollTop);
        }, 100);
      });
    }
  }
  
  // Initialize sidebar scroll preservation
  preserveSidebarScroll();
  
  // Initialize collapsible sidebar groups
  function initializeSidebarGroups() {
    const groupHeaders = document.querySelectorAll('.sidebar-group-header');
    
    // Add click handlers for toggling groups
    groupHeaders.forEach(header => {
      const targetId = header.getAttribute('data-toggle');
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        header.addEventListener('click', function() {
          const isExpanded = targetElement.classList.contains('expanded');
          const isCurrentPageInGroup = targetElement.querySelector('a.active');
          
          if (isExpanded) {
            // Only allow collapsing if current page is not in this group
            if (!isCurrentPageInGroup) {
              header.classList.remove('expanded');
              targetElement.classList.remove('expanded');
              sessionStorage.removeItem(`sidebar-${targetId}`);
            }
          } else {
            // Collapse all other groups first
            groupHeaders.forEach(otherHeader => {
              const otherTargetId = otherHeader.getAttribute('data-toggle');
              const otherTargetElement = document.getElementById(otherTargetId);
              const otherHasActivePage = otherTargetElement?.querySelector('a.active');
              
              if (otherTargetElement && otherTargetId !== targetId && !otherHasActivePage) {
                otherHeader.classList.remove('expanded');
                otherTargetElement.classList.remove('expanded');
                sessionStorage.removeItem(`sidebar-${otherTargetId}`);
              }
            });
            
            // Expand the clicked group
            header.classList.add('expanded');
            targetElement.classList.add('expanded');
            sessionStorage.setItem(`sidebar-${targetId}`, 'expanded');
          }
        });
      }
    });
  }
  
  initializeSidebarGroups();
  
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