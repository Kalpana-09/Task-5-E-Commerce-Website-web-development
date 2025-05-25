// js/common.js

document.addEventListener('DOMContentLoaded', () => {
    // Function to update the cart count displayed in the header
    window.updateGlobalCartCount = () => {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountElement.textContent = totalItems;
        }
    };

    // Function to format prices with currency symbol and two decimal places
    window.formatPrice = (price) => {
        // You can change 'INR' to your desired currency code (e.g., 'USD', 'EUR')
        // and 'en-IN' to your locale (e.g., 'en-US', 'de-DE')
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(price);
    };

    // Initial update of cart count when any page loads
    window.updateGlobalCartCount();

    // Basic navigation active state (optional, for visual feedback)
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add('active');
        }
        // Special handling for category-products.html if you want "Categories" to be active
        if (currentPath.includes('category-products.html') && link.href.includes('categories.html')) {
            link.classList.add('active');
        }
    });

    // You can add other common functionalities here, like:
    // - Smooth scrolling for anchor links
    // - General utility functions
    // - Event listeners for elements that appear on multiple pages
});