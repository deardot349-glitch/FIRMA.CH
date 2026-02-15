// Sample Product Data
const products = [
    {
        id: 1,
        name: 'Nike Air Max 90',
        brand: 'Nike',
        price: 4500,
        category: 'shoes',
        image: '👟',
        new: true,
        bestseller: true,
        stock: 5,
        sizes: ['40', '41', '42', '43', '44']
    },
    {
        id: 2,
        name: 'Essentials Hoodie',
        brand: 'Fear of God',
        price: 3200,
        category: 'clothing',
        image: '👕',
        new: true,
        bestseller: false,
        stock: 8,
        sizes: ['S', 'M', 'L', 'XL']
    },
    {
        id: 3,
        name: 'Sauvage EDT',
        brand: 'Dior',
        price: 2800,
        category: 'perfume',
        image: '🧴',
        new: false,
        bestseller: true,
        stock: 12,
        volumes: ['60ml', '100ml', '200ml']
    },
    {
        id: 4,
        name: 'Jordan 1 Retro',
        brand: 'Nike',
        price: 5200,
        category: 'shoes',
        image: '👟',
        new: true,
        bestseller: true,
        stock: 3,
        sizes: ['40', '41', '42', '43', '44', '45']
    },
    {
        id: 5,
        name: 'Tech Fleece Joggers',
        brand: 'Nike',
        price: 2400,
        category: 'clothing',
        image: '👖',
        new: false,
        bestseller: true,
        stock: 10,
        sizes: ['S', 'M', 'L', 'XL']
    },
    {
        id: 6,
        name: 'Aventus',
        brand: 'Creed',
        price: 8500,
        category: 'perfume',
        image: '🧴',
        new: true,
        bestseller: false,
        stock: 5,
        volumes: ['50ml', '100ml']
    },
    {
        id: 7,
        name: 'Mini Crossbody',
        brand: 'The North Face',
        price: 1500,
        category: 'accessories',
        image: '🎒',
        new: false,
        bestseller: true,
        stock: 15,
    },
    {
        id: 8,
        name: 'Yeezy 350 V2',
        brand: 'Adidas',
        price: 6800,
        category: 'shoes',
        image: '👟',
        new: true,
        bestseller: false,
        stock: 4,
        sizes: ['40', '41', '42', '43', '44']
    }
];

// Cart Management
class Cart {
    constructor() {
        this.items = this.loadCart();
        this.updateCartCount();
    }

    loadCart() {
        const saved = localStorage.getItem('firma_cart');
        return saved ? JSON.parse(saved) : [];
    }

    saveCart() {
        localStorage.setItem('firma_cart', JSON.stringify(this.items));
        this.updateCartCount();
    }

    addItem(productId, options = {}) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.items.find(item => 
            item.id === productId && 
            item.size === options.size &&
            item.volume === options.volume
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                ...product,
                quantity: 1,
                size: options.size,
                volume: options.volume
            });
        }

        this.saveCart();
        this.showNotification('Товар додано до кошика');
    }

    removeItem(index) {
        this.items.splice(index, 1);
        this.saveCart();
    }

    updateQuantity(index, quantity) {
        if (quantity <= 0) {
            this.removeItem(index);
        } else {
            this.items[index].quantity = quantity;
            this.saveCart();
        }
    }

    getTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    getCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    updateCartCount() {
        const countElement = document.getElementById('cartCount');
        if (countElement) {
            const count = this.getCount();
            countElement.textContent = count;
            countElement.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #F2F2F2;
            color: #0B0B0B;
            padding: 1rem 2rem;
            border-radius: 0;
            font-weight: 600;
            letter-spacing: 1px;
            z-index: 10000;
            animation: slideInRight 0.4s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.4s ease';
            setTimeout(() => notification.remove(), 400);
        }, 2000);
    }

    clear() {
        this.items = [];
        this.saveCart();
    }
}

// Initialize cart
const cart = new Cart();

// Search functionality
const searchToggle = document.getElementById('searchToggle');
const searchOverlay = document.getElementById('searchOverlay');
const searchClose = document.getElementById('searchClose');
const searchInput = document.getElementById('searchInput');

if (searchToggle) {
    searchToggle.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        setTimeout(() => searchInput.focus(), 100);
    });
}

if (searchClose) {
    searchClose.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
        searchInput.value = '';
    });
}

if (searchOverlay) {
    searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) {
            searchOverlay.classList.remove('active');
            searchInput.value = '';
        }
    });
}

// Menu toggle for mobile
const menuToggle = document.getElementById('menuToggle');
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        }
    });
}

// Render products on homepage
function renderProducts(containerId, filter) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let filtered = products;
    if (filter === 'new') {
        filtered = products.filter(p => p.new);
    } else if (filter === 'bestsellers') {
        filtered = products.filter(p => p.bestseller);
    }

    filtered = filtered.slice(0, 4);

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
}

function getCategoryName(category) {
    const names = {
        clothing: 'Одяг',
        shoes: 'Взуття',
        perfume: 'Парфуми',
        accessories: 'Аксесуари'
    };
    return names[category] || category;
}

// Load homepage products
if (document.getElementById('newProducts')) {
    renderProducts('newProducts', 'new');
}
if (document.getElementById('bestsellerProducts')) {
    renderProducts('bestsellerProducts', 'bestsellers');
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export for use in other pages
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { products, cart, Cart };
}
