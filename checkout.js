// Checkout page logic

function renderOrderSummary() {
    const summaryContainer = document.getElementById('orderSummary');
    const subtotal = cart.getTotal();
    const delivery = subtotal > 3000 ? 0 : 100;
    const total = subtotal + delivery;
    
    summaryContainer.innerHTML = `
        <h3 style="font-family: 'Orbitron', monospace; font-size: 1.3rem; margin-bottom: var(--spacing-md);">Ваше замовлення</h3>
        ${cart.items.map(item => `
            <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-sm); padding-bottom: var(--spacing-sm); border-bottom: 1px solid var(--color-border);">
                <div>
                    <div style="font-weight: 600;">${item.name}</div>
                    <div style="color: var(--color-muted); font-size: 0.85rem;">${item.quantity} × ${item.price} ₴</div>
                </div>
                <div style="font-weight: 700;">${item.price * item.quantity} ₴</div>
            </div>
        `).join('')}
        <div style="display: flex; justify-content: space-between; margin: var(--spacing-md) 0; padding: var(--spacing-sm) 0; border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border);">
            <span>Доставка:</span>
            <span>${delivery === 0 ? 'Безкоштовно' : delivery + ' ₴'}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-family: 'Orbitron', monospace; font-size: 1.5rem; font-weight: 900; margin-top: var(--spacing-md);">
            <span>Разом:</span>
            <span>${total} ₴</span>
        </div>
    `;
}

if (cart.items.length === 0) {
    window.location.href = 'cart.html';
} else {
    renderOrderSummary();
}

// Handle form submission
document.getElementById('checkoutForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const orderData = {
        id: 'FM-' + Math.floor(10000 + Math.random() * 90000),
        items: cart.items,
        customer: {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            city: formData.get('city'),
            department: formData.get('department')
        },
        payment: formData.get('payment'),
        comment: formData.get('comment'),
        total: cart.getTotal() + (cart.getTotal() > 3000 ? 0 : 100),
        date: new Date().toISOString()
    };
    
    // Save order
    localStorage.setItem('last_order', JSON.stringify(orderData));
    
    // Save to orders list
    const orders = JSON.parse(localStorage.getItem('firma_orders') || '[]');
    orders.push(orderData);
    localStorage.setItem('firma_orders', JSON.stringify(orders));
    
    // Clear cart
    cart.clear();
    
    // Redirect to success page
    window.location.href = 'order-success.html';
});
