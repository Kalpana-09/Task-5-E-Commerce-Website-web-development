// js/order-confirmation.js
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');

    const orderIdDisplay = document.getElementById('order-id-display');
    const confirmedOrderItems = document.getElementById('confirmed-order-items');
    const confirmedSubtotal = document.getElementById('confirmed-subtotal');
    const confirmedShippingCost = document.getElementById('confirmed-shipping-cost');
    const confirmedGrandTotal = document.getElementById('confirmed-grand-total');
    const confirmedShippingDetails = document.getElementById('confirmed-shipping-details');
    const errorMessageConfirmation = document.getElementById('error-message-confirmation');
    const confirmationContent = document.getElementById('confirmation-content');

    if (!orderId) {
        confirmationContent.style.display = 'none';
        errorMessageConfirmation.style.display = 'block';
        return;
    }

    const ordersHistory = JSON.parse(localStorage.getItem('ordersHistory')) || [];
    const confirmedOrder = ordersHistory.find(order => order.id === orderId);

    if (confirmedOrder) {
        orderIdDisplay.textContent = confirmedOrder.id;

        confirmedOrderItems.innerHTML = '';
        confirmedOrder.items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('confirmed-item');
            itemDiv.innerHTML = `
                <span>${item.name} x ${item.quantity}</span>
                <span>${window.formatPrice(item.price * item.quantity)}</span>
            `;
            confirmedOrderItems.appendChild(itemDiv);
        });

        // Recalculate totals based on the stored order for consistency
        let subtotal = 0;
        confirmedOrder.items.forEach(item => {
            subtotal += item.price * item.quantity;
        });
        const shipping = confirmedOrder.total - subtotal; // Get shipping cost from stored order total

        confirmedSubtotal.textContent = window.formatPrice(subtotal);
        confirmedShippingCost.textContent = window.formatPrice(shipping);
        confirmedGrandTotal.textContent = window.formatPrice(confirmedOrder.total);

        const shippingInfo = confirmedOrder.shippingInfo;
        confirmedShippingDetails.innerHTML = `
            ${shippingInfo.fullName}<br>
            ${shippingInfo.address}<br>
            ${shippingInfo.city}, ${shippingInfo.zipCode}<br>
            ${shippingInfo.country}
        `;
    } else {
        confirmationContent.style.display = 'none';
        errorMessageConfirmation.style.display = 'block';
    }
});