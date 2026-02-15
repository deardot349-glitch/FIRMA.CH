// Admin panel logic

const adminTabs = document.querySelectorAll('.admin-tab');
const adminSections = document.querySelectorAll('.admin-section');

adminTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        
        adminTabs.forEach(t => t.classList.remove('active'));
        adminSections.forEach(s => s.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
    });
});

// Load products table
function loadProductsTable() {
    const tbody = document.getElementById('productsTableBody');
    tbody.innerHTML = products.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.brand}</td>
            <td>${p.price} ₴</td>
            <td>${getCategoryName(p.category)}</td>
            <td>${p.stock} шт.</td>
            <td>
                <button class="action-btn" onclick="editProduct(${p.id})">Редагувати</button>
                <button class="action-btn delete-btn" onclick="deleteProduct(${p.id})">Видалити</button>
            </td>
        </tr>
    `).join('');
}

// Add product form
document.getElementById('addProductForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const newProduct = {
        id: products.length + 1,
        name: formData.get('name'),
        brand: formData.get('brand'),
        price: parseInt(formData.get('price')),
        category: formData.get('category'),
        image: formData.get('image') || '📦',
        stock: parseInt(formData.get('stock')),
        new: true,
        bestseller: false
    };
    
    if (formData.get('sizes')) {
        newProduct.sizes = formData.get('sizes').split(',').map(s => s.trim());
    }
    
    products.push(newProduct);
    alert('Товар успішно додано!');
    e.target.reset();
    loadProductsTable();
});

// Edit and delete functions
window.editProduct = function(id) {
    alert('Функція редагування буде додана пізніше');
};

window.deleteProduct = function(id) {
    if (confirm('Видалити цей товар?')) {
        const index = products.findIndex(p => p.id === id);
        if (index > -1) {
            products.splice(index, 1);
            loadProductsTable();
            alert('Товар видалено');
        }
    }
};

// Load orders
function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('firma_orders') || '[]');
    const tbody = document.getElementById('ordersTableBody');
    
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--color-muted);">Замовлень поки немає</td></tr>';
        return;
    }
    
    tbody.innerHTML = orders.reverse().map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${order.customer.firstName} ${order.customer.lastName}</td>
            <td>${order.customer.phone}</td>
            <td>${order.total} ₴</td>
            <td>В обробці</td>
            <td>
                <button class="action-btn">Деталі</button>
            </td>
        </tr>
    `).join('');
}

loadProductsTable();
loadOrders();
