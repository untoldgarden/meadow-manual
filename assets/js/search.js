(function() {
  let searchIndex = null;
  let searchData = [];
  let searchModal = null;
  let searchInput = null;
  let searchResults = null;
  let selectedIndex = -1;

  // Initialize search
  function initSearch() {
    loadSearchData();
    createSearchModal();
    bindSearchEvents();
  }

  // Check if lunr is available
  function waitForLunr(callback) {
    if (typeof lunr !== 'undefined') {
      callback();
    } else {
      console.log('Waiting for lunr to load...');
      setTimeout(() => waitForLunr(callback), 100);
    }
  }

  // Load search data
  function loadSearchData() {
    console.log('Loading search data...');
    
    // Wait for lunr to be available before proceeding
    waitForLunr(() => {
      console.log('Lunr is available, fetching search data...');
      
      fetch('/search.json')
        .then(response => {
          console.log('Search JSON response status:', response.status);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Search data loaded:', data.length, 'items');
          searchData = data;
          
          // Build the search index
          searchIndex = lunr(function() {
            this.ref('id');
            this.field('title', { boost: 10 });
            this.field('content');
            this.field('category', { boost: 5 });
            
            data.forEach((doc, idx) => {
              doc.id = idx;
              this.add(doc);
            });
          });
          
          console.log('Search index built successfully');
        })
        .catch(error => {
          console.error('Error loading search data:', error);
          // Set a flag to indicate loading failed
          searchIndex = false;
        });
    });
  }

  // Create search modal
  function createSearchModal() {
    const modalHTML = `
      <div id="search-modal" class="search-modal">
        <div class="search-modal-content">
          <div class="search-header">
            <input type="text" id="search-input" class="search-input" placeholder="Search documentation..." autocomplete="off">
            <button class="search-close" id="search-close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="search-results" id="search-results"></div>
          <div class="search-footer">
            <span class="search-hint">
              <kbd>↑↓</kbd> Navigate
              <kbd>Enter</kbd> Select
              <kbd>Esc</kbd> Close
            </span>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    searchModal = document.getElementById('search-modal');
    searchInput = document.getElementById('search-input');
    searchResults = document.getElementById('search-results');
  }

  // Bind search events
  function bindSearchEvents() {
    // Open search with CMD+K or Ctrl+K
    document.addEventListener('keydown', function(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
      
      if (e.key === 'Escape' && searchModal.classList.contains('active')) {
        closeSearch();
      }
    });

    // Click on search trigger
    const searchTrigger = document.querySelector('.search-trigger');
    if (searchTrigger) {
      searchTrigger.addEventListener('click', openSearch);
    }

    // Close button
    document.getElementById('search-close').addEventListener('click', closeSearch);

    // Click outside modal
    searchModal.addEventListener('click', function(e) {
      if (e.target === searchModal) {
        closeSearch();
      }
    });

    // Search input
    searchInput.addEventListener('input', performSearch);
    
    // Keyboard navigation
    searchInput.addEventListener('keydown', function(e) {
      const results = searchResults.querySelectorAll('.search-result');
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, results.length - 1);
        updateSelection(results);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, 0);
        updateSelection(results);
      } else if (e.key === 'Enter' && selectedIndex >= 0 && results[selectedIndex]) {
        e.preventDefault();
        window.location.href = results[selectedIndex].querySelector('a').href;
      }
    });
  }

  // Open search modal
  function openSearch() {
    searchModal.classList.add('active');
    searchInput.focus();
    searchInput.select();
    document.body.style.overflow = 'hidden';
  }

  // Close search modal
  function closeSearch() {
    searchModal.classList.remove('active');
    searchInput.value = '';
    searchResults.innerHTML = '';
    selectedIndex = -1;
    document.body.style.overflow = '';
  }

  // Perform search
  function performSearch() {
    const query = searchInput.value.trim();
    
    if (query.length < 2) {
      searchResults.innerHTML = '<div class="search-empty">Type at least 2 characters to search...</div>';
      return;
    }

    if (searchIndex === null) {
      searchResults.innerHTML = '<div class="search-empty">Search index is loading...</div>';
      return;
    }
    
    if (searchIndex === false) {
      searchResults.innerHTML = '<div class="search-empty">Search failed to load. Please refresh the page.</div>';
      return;
    }

    // Try multiple search strategies for better results
    let results = [];
    
    try {
      // Strategy 1: Exact search
      results = searchIndex.search(query);
      
      // Strategy 2: If no results, try with wildcards for partial matches
      if (results.length === 0 && query.length >= 3) {
        const wildcardQuery = query.split(/\s+/).map(term => {
          if (term.length >= 3) {
            return term + '*';
          }
          return term;
        }).join(' ');
        results = searchIndex.search(wildcardQuery);
      }
      
      // Strategy 3: If still no results, try fuzzy search
      if (results.length === 0 && query.length >= 4) {
        const fuzzyQuery = query.split(/\s+/).map(term => {
          if (term.length >= 4) {
            return term + '~1';
          }
          return term;
        }).join(' ');
        results = searchIndex.search(fuzzyQuery);
      }
      
      // Strategy 4: Last resort - search individual terms with wildcards
      if (results.length === 0 && query.length >= 3) {
        const terms = query.split(/\s+/);
        for (const term of terms) {
          if (term.length >= 3) {
            const termResults = searchIndex.search(term + '*');
            results = results.concat(termResults);
          }
        }
        // Remove duplicates
        const seen = new Set();
        results = results.filter(result => {
          if (seen.has(result.ref)) {
            return false;
          }
          seen.add(result.ref);
          return true;
        });
      }
    } catch (error) {
      console.warn('Search error:', error);
      // Fallback to simple search
      results = searchIndex.search(query);
    }
    
    displayResults(results, query);
  }

  // Display search results
  function displayResults(results, query) {
    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-empty">No results found</div>';
      return;
    }

    selectedIndex = -1;
    
    // Group results by category
    const grouped = {};
    results.forEach(result => {
      const doc = searchData[result.ref];
      if (!grouped[doc.category]) {
        grouped[doc.category] = [];
      }
      grouped[doc.category].push({ ...doc, score: result.score });
    });

    let html = '';
    Object.keys(grouped).forEach(category => {
      html += `<div class="search-category">${category}</div>`;
      grouped[category].forEach(doc => {
        const excerpt = getExcerpt(doc.content, query);
        html += `
          <div class="search-result">
            <a href="${doc.url}">
              <div class="search-result-title">${highlightTerms(doc.title, query)}</div>
              <div class="search-result-excerpt">${highlightTerms(excerpt, query)}</div>
            </a>
          </div>
        `;
      });
    });

    searchResults.innerHTML = html;
  }

  // Get excerpt around search term
  function getExcerpt(content, query) {
    const cleanContent = content.replace(/\s+/g, ' ').trim();
    const terms = query.toLowerCase().split(/\s+/);
    const contentLower = cleanContent.toLowerCase();
    
    let bestIndex = -1;
    for (const term of terms) {
      const index = contentLower.indexOf(term);
      if (index > -1) {
        bestIndex = index;
        break;
      }
    }
    
    if (bestIndex === -1) {
      return cleanContent.substring(0, 150) + '...';
    }
    
    const start = Math.max(0, bestIndex - 50);
    const end = Math.min(cleanContent.length, bestIndex + 100);
    let excerpt = cleanContent.substring(start, end);
    
    if (start > 0) excerpt = '...' + excerpt;
    if (end < cleanContent.length) excerpt = excerpt + '...';
    
    return excerpt;
  }

  // Highlight search terms
  function highlightTerms(text, query) {
    const terms = query.split(/\s+/).filter(t => t.length > 0);
    let highlighted = text;
    
    terms.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi');
      highlighted = highlighted.replace(regex, '<mark>$1</mark>');
    });
    
    return highlighted;
  }

  // Update keyboard selection
  function updateSelection(results) {
    results.forEach((result, index) => {
      if (index === selectedIndex) {
        result.classList.add('selected');
        result.scrollIntoView({ block: 'nearest' });
      } else {
        result.classList.remove('selected');
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
  } else {
    initSearch();
  }
})();