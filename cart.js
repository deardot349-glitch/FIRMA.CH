// Cart page logic

function renderCart() {
    const itemsContainer = document.getElementById('cartItems');
    const summaryContainer = document.getElementById('cartSummary');
    
    if (cart.items.length === 0) {
        document.getElementById('cartLayout').innerHTML = `
            <div class="empty-cart" style="grid-column: 1 / -1;">
                <h2 style="font-family: 'Orbitron', monospace; font-size: 2rem; margin-bottom: 1rem;">Кошик порожній</h2>
                <p style="margin-bottom: 2rem;">Додайте товари до кошика, щоб продовжити покупки</p>
                <a href="catalog.html" class="btn btn-primary">Перейти до каталогу</a>
            </div>
        `;
        return;
    }
    
    // Render cart items
    itemsContainer.innerHTML = cart.items.map((item, index) => `
        <div class="cart-item">
            <div class="cart-item-image">${item.image}</div>
            <div class="cart-item-info">
                <div class="cart-item-brand">${item.brand}</div>
                <div class="cart-item-name">${item.name}</div>
                ${item.size ? `<div class="cart-item-option">Розмір: ${item.size}</div>` : ''}
                ${item.volume ? `<div class="cart-item-option">Об'єм: ${item.volume}</div>` : ''}
            </div>
            <div class="cart-item-actions">
                <div class="cart-item-price">${item.price * item.quantity} ₴</div>
                <div class="quantity-control">
                    <button class="quantity-btn" data-index="${index}" data-action="decrease">-</button>
                    <div class="quantity-value">${item.quantity}</div>
                    <button class="quantity-btn" data-index="${index}" data-action="increase">+</button>
                </div>
                <button class="remove-btn" data-index="${index}">Видалити</button>
            </div>
        </div>
    `).join('');
    
    // Render summary
    const subtotal = cart.getTotal();
    const delivery = subtotal > 3000 ? 0 : 100;
    const total = subtotal + delivery;
    
    summaryContainer.innerHTML = `
        <h3 class="summary-title">Підсумок</h3>
        <div class="summary-row">
            <span>Товарів:</span>
            <span>${cart.getCount()} шт.</span>
        </div>
        <div class="summary-row">
            <span>Сума:</span>
            <span>${subtotal} ₴</span>
        </div>
        <div class="summary-row">
            <span>Доставка:</span>
            <span>${delivery === 0 ? 'Безкоштовно' : delivery + ' ₴'}</span>
        </div>
        <div class="summary-total">
            <span>Разом:</span>
            <span>${total} ₴</span>
        </div>
        ${delivery > 0 ? `<p style="color: var(--color-muted); font-size: 0.85rem; text-align: center;">Безкоштовна доставка від 3000 ₴</p>` : ''}
        <a href="checkout.html" class="btn btn-primary" style="width: 100%; margin-top: var(--spacing-md);">Оформити замовлення</a>
        <a href="catalog.html" class="btn btn-secondary" style="width: 100%; margin-top: var(--spacing-sm);">Продовжити покупки</a>
    `;
    
    // Add event listeners
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            const action = btn.dataset.action;
            const currentQty = cart.items[index].quantity;
            
            if (action === 'increase') {
                cart.updateQuantity(index, currentQty + 1);
            } else if (action === 'decrease') {
                cart.updateQuantity(index, currentQty - 1);
            }
            
            renderCart();
        });
    });
    
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            cart.removeItem(index);
            renderCart();
        });
    });
}

renderCart();
