// js/contact.js
document.addEventListener('DOMContentLoaded', () => {
    // This script can be used for contact form submission handling (e.g., AJAX)
    // or client-side validation.
    console.log('Contact Us page loaded.');

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default form submission

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Simple client-side validation (for demonstration)
            if (!name || !email || !message) {
                alert('Please fill in all required fields.');
                return;
            }

            // In a real application, you would send this data to a backend server
            // using fetch() or XMLHttpRequest.
            console.log('Contact Form Submitted:', {
                name,
                email,
                subject,
                message
            });

            alert('Thank you for your message! We will get back to you shortly.');

            contactForm.reset(); // Clear the form
        });
    }
});