// Catalog filtering and sorting logic

let currentFilters = {
    categories: [],
    brands: [],
    inStock: false
};

let currentSort = 'default';

function renderCatalogProducts() {
    const container = document.getElementById('catalogProducts');
    if (!container) return;

    // Apply filters
    let filtered = products.filter(product => {
        if (currentFilters.categories.length > 0 && !currentFilters.categories.includes(product.category)) {
            return false;
        }
        if (currentFilters.brands.length > 0 && !currentFilters.brands.includes(product.brand)) {
            return false;
        }
        if (currentFilters.inStock && product.stock === 0) {
            return false;
        }
        return true;
    });

    // Apply sort
    switch (currentSort) {
        case 'price-asc':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }

    // Update results count
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        resultsCount.textContent = `Знайдено товарів: ${filtered.length}`;
    }

    // Render products
    container.innerHTML = filtered.map(product => `
        <a href="product.html?id=${product.id}" class="product-card">
            ${product.new ? '<span class="product-badge">NEW</span>' : ''}
            <div class="product-image">${product.image}</div>
            <div class="product-info">
                <div class="product-brand">${product.brand}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-price">${product.price} ₴</div>
                <span class="product-category">${getCategoryName(product.category)}</span>
            </div>
        </a>
    `).join('');

    // Add smooth fade-in animation
    container.querySelectorAll('.product-card').forEach((card, index) => {
        card.style.animation = `fadeInUp 0.4s ease ${index * 0.05}s backwards`;
    });
}

// Initialize filters
document.querySelectorAll('#categoryFilters input').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
            currentFilters.categories.push(e.target.value);
        } else {
            currentFilters.categories = currentFilters.categories.filter(c => c !== e.target.value);
        }
        renderCatalogProducts();
    });
});

document.querySelectorAll('#brandFilters input').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
            currentFilters.brands.push(e.target.value);
        } else {
            currentFilters.brands = currentFilters.brands.filter(b => b !== e.target.value);
        }
        renderCatalogProducts();
    });
});

const inStockFilter = document.getElementById('inStockFilter');
if (inStockFilter) {
    inStockFilter.addEventListener('change', (e) => {
        currentFilters.inStock = e.target.checked;
        renderCatalogProducts();
    });
}

// Sort functionality
const sortSelect = document.getElementById('sortSelect');
if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderCatalogProducts();
    });
}

// Clear filters
const clearFiltersBtn = document.getElementById('clearFilters');
if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
        currentFilters = {
            categories: [],
            brands: [],
            inStock: false
        };
        currentSort = 'default';
        
        document.querySelectorAll('.filter-option input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });
        
        sortSelect.value = 'default';
        renderCatalogProducts();
    });
}

// Check URL parameters
const urlParams = new URLSearchParams(window.location.search);
const categoryParam = urlParams.get('category');
const filterParam = urlParams.get('filter');

if (categoryParam) {
    currentFilters.categories.push(categoryParam);
    const checkbox = document.querySelector(`#categoryFilters input[value="${categoryParam}"]`);
    if (checkbox) checkbox.checked = true;
}

if (filterParam === 'new') {
    // Only show new products
    currentFilters.new = true;
}

// Initial render
renderCatalogProducts();
