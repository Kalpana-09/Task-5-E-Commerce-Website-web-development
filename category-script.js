// js/category-script.js

document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('productGrid');
    const loadingMessage = document.getElementById('loading-message');
    const noProductsMessage = document.getElementById('no-products-message');
    const categoryTitle = document.getElementById('category-title');
    const currentCategoryName = document.getElementById('current-category-name');

    let allProducts = []; // To store all fetched products

    // Helper function to get URL parameter (e.g., 'category' from ?category=electronics)
    const getUrlParameter = (name) => {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    const requestedCategory = getUrlParameter('category');

    // Function to fetch all products and then filter them by category
    const fetchAndFilterProducts = async () => {
        try {
            loadingMessage.style.display = 'block'; // Show loading message
            productGrid.innerHTML = ''; // Clear any existing content in the grid

            const response = await fetch('products.json'); // Fetch products from products.json
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allProducts = await response.json(); // Store all products

            loadingMessage.style.display = 'none'; // Hide loading message

            let filteredProducts = [];

            if (requestedCategory) {
                // Format category name for display (e.g., 'electronics' -> 'Electronics')
                const displayCategoryName = requestedCategory.charAt(0).toUpperCase() + requestedCategory.slice(1).replace('-', ' ');
                categoryTitle.textContent = displayCategoryName; // Update main page title
                currentCategoryName.textContent = displayCategoryName; // Update section title

                // Filter products based on the category from the URL
                filteredProducts = allProducts.filter(product =>
                    product.category && product.category.toLowerCase() === requestedCategory.toLowerCase()
                );
            } else {
                // If no category parameter is present, display all products (as a fallback)
                categoryTitle.textContent = "All";
                currentCategoryName.textContent = "All Products";
                filteredProducts = allProducts;
            }

            if (filteredProducts.length > 0) {
                // Render each filtered product
                filteredProducts.forEach(renderProduct);
                setupLazyLoading(); // Apply lazy loading if you have it
                noProductsMessage.style.display = 'none'; // Hide no products message
            } else {
                noProductsMessage.style.display = 'block'; // Show no products message
                noProductsMessage.textContent = `No products found for "${requestedCategory.replace('-', ' ')}".`;
                categoryTitle.textContent = "No"; // Adjust header title for no products
                currentCategoryName.textContent = `No Products for ${requestedCategory.replace('-', ' ')}`;
            }

        } catch (error) {
            console.error('Failed to fetch or filter products:', error);
            loadingMessage.textContent = 'Failed to load products. Please try again later.';
            loadingMessage.style.color = '#e74c3c';
            noProductsMessage.style.display = 'none';
        }
    };

    // Function to create and append a single product card to the grid
    const renderProduct = (product) => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card'); // Ensure you have styles for .product-card

        // Use product.image for the image path, ensure it's relative to category-products.html
        // THIS IS THE LINE THAT USES THE PATH FROM products.json:
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

    // Lazy loading function (can be improved, but this is a basic version)
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
            lazyloadImages.forEach(img => { imageObserver.observe(img); });
        } else {
            // Fallback for browsers without IntersectionObserver
            lazyloadImages.forEach(img => { img.src = img.dataset.src; });
        }
    };

    // Add to Cart Logic (same as in script.js to keep consistency)
    const addToCart = (productId) => {
        const productToAdd = allProducts.find(p => p.id === productId);
        if (productToAdd) {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    id: productToAdd.id,
                    name: productToAdd.name,
                    price: productToAdd.price,
                    image: productToAdd.image, // Ensure image path is correct
                    quantity: 1
                });
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            // Update cart count in header using the global function from common.js
            if (typeof window.updateGlobalCartCount === 'function') {
                   window.updateGlobalCartCount();
            } else {
                console.warn("updateGlobalCartCount not found. Cart count in header might not update.");
            }
            alert(`${productToAdd.name} added to cart!`);
        }
    };

    // Event delegation for "Add to Cart" buttons
    // Attaching the listener to productGrid allows it to catch clicks on dynamically added buttons
    productGrid.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart-btn')) {
            const productId = event.target.dataset.productId; // productId is already a string
            addToCart(productId);
        }
    });

    // Initial fetch and render of products when the page loads
    fetchAndFilterProducts();

    // Update cart count on page load
    if (typeof window.updateGlobalCartCount === 'function') {
        window.updateGlobalCartCount();
    }
});