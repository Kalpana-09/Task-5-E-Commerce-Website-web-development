// js/checkout.js
document.addEventListener('DOMContentLoaded', async () => {
    const shippingForm = document.getElementById('shipping-form');
    const checkoutOrderItems = document.getElementById('checkout-order-items');
    const checkoutSubtotal = document.getElementById('checkout-subtotal');
    const checkoutShippingCost = document.getElementById('checkout-shipping-cost');
    const checkoutGrandTotal = document.getElementById('checkout-grand-total');
    const placeOrderBtn = document.getElementById('place-order-btn');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const renderOrderSummary = () => {
        checkoutOrderItems.innerHTML = '';
        let subtotal = 0;
        const shipping = 500; // Fixed shipping for demo

        if (cart.length === 0) {
            checkoutOrderItems.innerHTML = '<p style="text-align: center; color: #e74c3c;">Your cart is empty. Please add items to proceed to checkout.</p>';
            placeOrderBtn.disabled = true;
            placeOrderBtn.textContent = 'Cart is Empty';
            checkoutSubtotal.textContent = window.formatPrice(0);
            checkoutShippingCost.textContent = window.formatPrice(0);
            checkoutGrandTotal.textContent = window.formatPrice(0);
            return;
        }

        cart.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('checkout-item');
            itemDiv.innerHTML = `
                <span class="item-name-qty">${item.name} x ${item.quantity}</span>
                <span class="item-price">${window.formatPrice(item.price * item.quantity)}</span>
            `;
            checkoutOrderItems.appendChild(itemDiv);
            subtotal += item.price * item.quantity;
        });

        const grandTotal = subtotal + shipping;

        checkoutSubtotal.textContent = window.formatPrice(subtotal);
        checkoutShippingCost.textContent = window.formatPrice(shipping);
        checkoutGrandTotal.textContent = window.formatPrice(grandTotal);
        placeOrderBtn.disabled = false;
        placeOrderBtn.textContent = 'Place Order';
    };

    renderOrderSummary();

    placeOrderBtn.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default form submission

        if (cart.length === 0) {
            alert('Your cart is empty. Please add items before placing an order.');
            return;
        }

        // Validate shipping form inputs
        const fullName = document.getElementById('fullName').value.trim();
        const address = document.getElementById('address').value.trim();
        const city = document.getElementById('city').value.trim();
        const zipCode = document.getElementById('zipCode').value.trim();
        const country = document.getElementById('country').value.trim();

        if (!fullName || !address || !city || !zipCode || !country) {
            alert('Please fill in all shipping information fields.');
            return;
        }

        // --- Simulated Order Confirmation & Storage ---
        const orderId = 'ORD-' + Date.now(); // Simple unique ID
        const orderTotal = parseFloat(checkoutGrandTotal.textContent.replace('₹', '').replace(/,/g, ''));

        const orderSummary = {
            id: orderId,
            items: cart.map(item => ({ // Create a clean copy of cart items for the order history
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image // Include image for order history display if needed
            })),
            total: orderTotal,
            shippingInfo: { fullName, address, city, zipCode, country },
            date: new Date().toLocaleDateString('en-IN'), // Format date
            time: new Date().toLocaleTimeString('en-IN'), // Format time
            status: 'Pending' // Initial status
        };

        // Store this "order" in local storage for a basic "order history" view
        let ordersHistory = JSON.parse(localStorage.getItem('ordersHistory')) || [];
        ordersHistory.push(orderSummary);
        localStorage.setItem('ordersHistory', JSON.stringify(ordersHistory));

        // Clear the cart after "placing" the order
        localStorage.removeItem('cart');
        cart = []; // Empty the current cart array in JS
        window.updateCartCount(); // Update header cart count via common.js

        alert(`Order ${orderId} placed successfully!\n\nThank you for your purchase.`);

        // Redirect to a confirmation page
        window.location.href = 'order-confirmation.html?orderId=' + orderId;
    });
});