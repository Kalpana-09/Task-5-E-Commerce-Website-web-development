// js/order-history.js
document.addEventListener('DOMContentLoaded', () => {
    const orderListContainer = document.getElementById('order-list');
    const noOrdersMessage = document.getElementById('no-orders-message');

    const ordersHistory = JSON.parse(localStorage.getItem('ordersHistory')) || [];

    if (ordersHistory.length === 0) {
        noOrdersMessage.style.display = 'block';
    } else {
        noOrdersMessage.style.display = 'none';
        // Sort orders by date/time, newest first
        ordersHistory.sort((a, b) => new Date(`${b.date} ${b.time}`) - new Date(`${a.date} ${a.time}`));

        ordersHistory.forEach(order => {
            const orderCard = document.createElement('div');
            orderCard.classList.add('order-card');

            let itemsHtml = order.items.map(item => `
                <li>${item.name} x ${item.quantity} (${window.formatPrice(item.price * item.quantity)})</li>
            `).join('');

            orderCard.innerHTML = `
                <h3>Order ID: ${order.id}</h3>
                <p>Date: ${order.date} | Time: ${order.time}</p>
                <p>Status: ${order.status || 'Delivered'} </p>
                <h4>Items:</h4>
                <ul class="order-items-list">
                    ${itemsHtml}
                </ul>
                <div class="order-total">Total: ${window.formatPrice(order.total)}</div>
                <p>Shipping To: ${order.shippingInfo.fullName}, ${order.shippingInfo.address}, ${order.shippingInfo.city}</p>
            `;
            orderListContainer.appendChild(orderCard);
        });
    }
});