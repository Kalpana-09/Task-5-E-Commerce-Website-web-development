// js/cart.js
document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const subtotalElement = document.getElementById('subtotal');
    const shippingCostElement = document.getElementById('shipping-cost');
    const grandTotalElement = document.getElementById('grand-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const calculateCartTotals = () => {
        let subtotal = 0;
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
        });

        // Fixed shipping rate for demo (e.g., ₹500)
        // Only apply shipping if there are items in the cart
        const shipping = cart.length > 0 ? 500 : 0;
        const grandTotal = subtotal + shipping;

        subtotalElement.textContent = window.formatPrice(subtotal);
        shippingCostElement.textContent = window.formatPrice(shipping);
        grandTotalElement.textContent = window.formatPrice(grandTotal);

        // Disable checkout button if cart is empty
        if (cart.length === 0) {
            checkoutBtn.disabled = true;
            checkoutBtn.textContent = 'Cart is Empty';
        } else {
            checkoutBtn.disabled = false;
            checkoutBtn.textContent = 'Proceed to Checkout';
        }
    };

    const renderCartItems = () => {
        cartItemsContainer.innerHTML = ''; // Clear existing items

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            cartItemsContainer.style.display = 'none';
        } else {
            emptyCartMessage.style.display = 'none';
            cartItemsContainer.style.display = 'block';
            cart.forEach(item => {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');
                cartItemDiv.dataset.productId = item.id; // Store product ID for easy access

                cartItemDiv.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <div class="price">${window.formatPrice(item.price)}</div>
                        <div class="item-quantity">
                            <button class="quantity-btn decrease-qty" data-id="${item.id}">-</button>
                            <input type="number" class="qty-input" value="${item.quantity}" min="1" readonly>
                            <button class="quantity-btn increase-qty" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <button class="remove-item-btn" data-id="${item.id}">Remove</button>
                `;
                cartItemsContainer.appendChild(cartItemDiv);
            });
        }
        calculateCartTotals();
        window.updateCartCount(); // Update header cart count
    };

    const updateQuantity = (productId, change) => {
        const itemIndex = cart.findIndex(item => item.id === productId);
        if (itemIndex > -1) {
            cart[itemIndex].quantity += change;
            if (cart[itemIndex].quantity <= 0) {
                // If quantity drops to 0 or less, remove the item
                cart.splice(itemIndex, 1);
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCartItems(); // Re-render the cart to update UI and totals
        }
    };

    const removeItem = (productId) => {
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems(); // Re-render the cart
    };

    // Event listeners for quantity change and remove buttons using delegation
    cartItemsContainer.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('increase-qty')) {
            updateQuantity(target.dataset.id, 1);
        } else if (target.classList.contains('decrease-qty')) {
            updateQuantity(target.dataset.id, -1);
        } else if (target.classList.contains('remove-item-btn')) {
            removeItem(target.dataset.id);
        }
    });

    // Checkout button click handler
    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            window.location.href = 'checkout.html';
        } else {
            alert('Your cart is empty. Add some products first!');
        }
    });

    renderCartItems(); // Initial render of cart items on page load
});