// js/script.js (for index.html)
document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('productGrid');
    const loadingMessage = document.getElementById('loading-message');
    let products = []; // To store fetched products

    // Function to fetch products from products.json
    const fetchProducts = async () => {
        try {
            loadingMessage.style.display = 'block'; // Show loading message
            const response = await fetch('products.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            products = await response.json();
            loadingMessage.style.display = 'none'; // Hide loading message
            products.forEach(renderProduct);
            setupLazyLoading(); // Call lazy loading after products are rendered
        } catch (error) {
            console.error('Failed to fetch products:', error);
            loadingMessage.textContent = 'Failed to load products. Please try again later.';
            loadingMessage.style.color = '#e74c3c'; // Make error message red
        }
    };

    // Function to render a single product card
    const renderProduct = (product) => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        productCard.innerHTML = `
            <a href="product-detail.html?id=${product.id}" class="product-link">
                <img data-src="${product.image}" alt="${product.name}" class="lazyload">
                <div class="product-info">
                    <h2>${product.name}</h2>
                    <p>${product.description}</p>
                    <div class="price">${window.formatPrice(product.price)}</div>
                </div>
            </a>
            <button class="add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
        `;
        productGrid.appendChild(productCard);
    };

    // Function to set up lazy loading for images
    const setupLazyLoading = () => {
        const lazyloadImages = document.querySelectorAll('.lazyload');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazyload');
                        observer.unobserve(img);
                    }
                });
            });

            lazyloadImages.forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            lazyloadImages.forEach(img => {
                img.src = img.dataset.src;
            });
        }
    };

    // --- Shopping Cart Logic ---
    // Note: 'cart' is loaded from localStorage. common.js handles updating the header count.

    const addToCart = (productId) => {
        const productToAdd = products.find(p => p.id === productId);
        if (productToAdd) {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                // Ensure to save a copy, not a reference, and add quantity
                cart.push({
                    id: productToAdd.id,
                    name: productToAdd.name,
                    price: productToAdd.price,
                    image: productToAdd.image,
                    quantity: 1
                });
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            window.updateCartCount(); // Update the cart count in the header
            alert(`${productToAdd.name} added to cart!`);
        }
    };

    // Event delegation for "Add to Cart" buttons
    productGrid.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart-btn')) {
            const productId = event.target.dataset.productId;
            addToCart(productId);
        }
    });

    // Initialize fetching products when the DOM is ready
    fetchProducts();
});