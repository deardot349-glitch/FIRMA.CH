// Order success page logic

const lastOrder = JSON.parse(localStorage.getItem('last_order'));

if (lastOrder) {
    document.getElementById('orderId').textContent = lastOrder.id;
    
    const detailsContainer = document.getElementById('orderDetails');
    detailsContainer.innerHTML = `
        <div class="detail-row">
            <span>Клієнт:</span>
            <span>${lastOrder.customer.firstName} ${lastOrder.customer.lastName}</span>
        </div>
        <div class="detail-row">
            <span>Телефон:</span>
            <span>${lastOrder.customer.phone}</span>
        </div>
        <div class="detail-row">
            <span>Місто:</span>
            <span>${lastOrder.customer.city}</span>
        </div>
        <div class="detail-row">
            <span>Відділення:</span>
            <span>${lastOrder.customer.department}</span>
        </div>
        <div class="detail-row">
            <span>Спосіб оплати:</span>
            <span>${lastOrder.payment === 'cash' ? 'При отриманні' : 'Карткою'}</span>
        </div>
        <div class="detail-row" style="border-bottom: none; font-weight: 700; font-size: 1.2rem;">
            <span>Сума:</span>
            <span>${lastOrder.total} ₴</span>
        </div>
    `;
    
    // Save order ID to localStorage for tracking
    localStorage.setItem('current_order_id', lastOrder.id);
} else {
    window.location.href = 'index.html';
}
