// js/category-script.js
document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('productGrid');
    const loadingMessage = document.getElementById('loading-message');
    const noProductsMessage = document.getElementById('no-products-message');
    const categoryTitle = document.getElementById('category-title');
    const currentCategoryName = document.getElementById('current-category-name');

    let allProducts = [];

    const getUrlParameter = (name) => { /* ... (same as previous response) ... */ };
    const requestedCategory = getUrlParameter('category');
    const fetchAndFilterProducts = async () => { /* ... (same as previous response) ... */ };
    const renderProduct = (product) => { /* ... (same as previous response) ... */ };
    const setupLazyLoading = () => { /* ... (same as previous response) ... */ };
    const addToCart = (productId) => { /* ... (same as previous response) ... */ };

    productGrid.addEventListener('click', (event) => { // This is the crucial part for add-to-cart on this page
        if (event.target.classList.contains('add-to-cart-btn')) {
            const productId = event.target.dataset.productId;
            addToCart(productId);
        }
    });

    fetchAndFilterProducts();
    if (typeof window.updateGlobalCartCount === 'function') {
        window.updateGlobalCartCount();
    }
});