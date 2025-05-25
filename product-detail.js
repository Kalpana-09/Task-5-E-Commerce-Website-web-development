// js/product-detail.js
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    const productDetailContent = document.getElementById('product-detail-content');
    const loadingMessage = document.getElementById('loading-message');
    const notFoundMessage = document.getElementById('not-found-message');
    const productTitle = document.getElementById('productTitle');
    const headerTitle = document.getElementById('headerTitle');

    if (!productId) {
        loadingMessage.style.display = 'none';
        notFoundMessage.style.display = 'block';
        productDetailContent.innerHTML = '';
        return;
    }

    try {
        loadingMessage.style.display = 'block';
        const response = await fetch('products.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const productsData = await response.json();
        const product = productsData.find(p => p.id === productId);

        loadingMessage.style.display = 'none';

        if (product) {
            productTitle.textContent = `${product.name} - My E-commerce`;
            headerTitle.textContent = product.name;
            productDetailContent.innerHTML = `
                <div class="detail-image-wrapper">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="detail-info">
                    <h2>${product.name}</h2>
                    <div class="price">${window.formatPrice(product.price)}</div>
                    <p class="description">${product.description}</p>
                    <button class="add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
                </div>
            `;

            // Add to Cart functionality for this page
            document.querySelector('.add-to-cart-btn').addEventListener('click', () => {
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                const existingItem = cart.find(item => item.id === productId);
                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    // Ensure to save a copy, not a reference, and add quantity
                    cart.push({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        quantity: 1
                    });
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                window.updateCartCount(); // Update header cart count via common.js
                alert(`${product.name} added to cart!`);
            });

        } else {
            notFoundMessage.style.display = 'block';
        }

    } catch (error) {
        console.error('Error fetching product details:', error);
        loadingMessage.style.display = 'none';
        productDetailContent.innerHTML = '<p style="color: #e74c3c; text-align: center; padding: 50px;">Error loading product details. Please try again.</p>';
    }
});