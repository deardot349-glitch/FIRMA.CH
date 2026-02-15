// Product page logic

const urlParams = new URLSearchParams(window.location.search);
const productId = parseInt(urlParams.get('id'));
const product = products.find(p => p.id === productId);

let selectedSize = null;
let selectedVolume = null;

if (product) {
    renderProduct();
    renderSimilarProducts();
} else {
    window.location.href = 'catalog.html';
}

function renderProduct() {
    const layout = document.getElementById('productLayout');
    
    const hasOptions = product.sizes || product.volumes;
    const inStock = product.stock > 0;
    
    layout.innerHTML = `
        <div class="product-gallery">
            <div class="product-main-image">${product.image}</div>
            <div class="product-thumbnails">
                <div class="thumbnail">${product.image}</div>
                <div class="thumbnail">${product.image}</div>
                <div class="thumbnail">${product.image}</div>
                <div class="thumbnail">${product.image}</div>
            </div>
        </div>
        
        <div class="product-details">
            <div class="product-header">
                <div class="product-detail-brand">${product.brand}</div>
                <h1 class="product-detail-name">${product.name}</h1>
                <div class="product-detail-price">${product.price} ₴</div>
            </div>
            
            ${product.sizes ? `
                <div class="option-group">
                    <label>Розмір</label>
                    <div class="size-options">
                        ${product.sizes.map(size => `
                            <button class="size-btn" data-size="${size}">${size}</button>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            ${product.volumes ? `
                <div class="option-group">
                    <label>Об'єм</label>
                    <div class="volume-options">
                        ${product.volumes.map(volume => `
                            <button class="volume-btn" data-volume="${volume}">${volume}</button>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            <div class="stock-status ${!inStock ? 'out-of-stock' : ''}">
                <div class="stock-indicator"></div>
                <span>${inStock ? `В наявності: ${product.stock} шт.` : 'Немає в наявності'}</span>
            </div>
            
            <div class="product-actions">
                <button class="btn-add-to-cart" id="addToCartBtn" ${!inStock ? 'disabled' : ''}>
                    Додати до кошика
                </button>
            </div>
            
            <div class="product-description">
                <h3>Опис</h3>
                <p>Оригінальний товар від бренду ${product.brand}. Гарантія автентичності. Всі товари проходять ретельну перевірку перед відправкою.</p>
                <p>Категорія: ${getCategoryName(product.category)}</p>
            </div>
        </div>
    `;
    
    // Add size selection
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedSize = btn.dataset.size;
        });
    });
    
    // Add volume selection
    document.querySelectorAll('.volume-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.volume-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedVolume = btn.dataset.volume;
        });
    });
    
    // Add to cart
    const addToCartBtn = document.getElementById('addToCartBtn');
    addToCartBtn.addEventListener('click', () => {
        if (!inStock) return;
        
        if (hasOptions && !selectedSize && !selectedVolume) {
            alert('Будь ласка, оберіть розмір або об\'єм');
            return;
        }
        
        cart.addItem(product.id, {
            size: selectedSize,
            volume: selectedVolume
        });
    });
}

function renderSimilarProducts() {
    const container = document.getElementById('similarProducts');
    const similar = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);
    
    container.innerHTML = similar.map(p => `
        <a href="product.html?id=${p.id}" class="product-card">
            ${p.new ? '<span class="product-badge">NEW</span>' : ''}
            <div class="product-image">${p.image}</div>
            <div class="product-info">
                <div class="product-brand">${p.brand}</div>
                <div class="product-name">${p.name}</div>
                <div class="product-price">${p.price} ₴</div>
                <span class="product-category">${getCategoryName(p.category)}</span>
            </div>
        </a>
    `).join('');
}
