document.addEventListener('DOMContentLoaded', () => {
    const orderItemsContainer = document.getElementById('order-items');
    const summaryTotalElement = document.getElementById('summary-total');
    const checkoutForm = document.getElementById('checkout-form');
    const modal = document.getElementById('thank-you-modal');

    // Load Cart
    const cart = JSON.parse(localStorage.getItem('woodmartChart')) || [];

    if (cart.length === 0) {
        orderItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        summaryTotalElement.innerText = '$0.00';
    } else {
        let total = 0;
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const itemEl = document.createElement('div');
            itemEl.className = 'summary-item';
            itemEl.innerHTML = `
                <div class="summary-item-info">
                    <img src="${item.image}" alt="${item.name}">
                    <div>
                        <h4>${item.name}</h4>
                        <p>Qty: ${item.quantity}</p>
                    </div>
                </div>
                <span>$${itemTotal.toFixed(2)}</span>
            `;
            orderItemsContainer.appendChild(itemEl);
        });
        summaryTotalElement.innerText = `$${total.toFixed(2)}`;
    }

    // Handle Submit
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        // Simulate API call/processing
        const btn = checkoutForm.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = 'Processing...';
        btn.disabled = true;

        setTimeout(() => {
            // Success
            localStorage.removeItem('woodmartChart');
            modal.classList.add('active');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        }, 1500);
    });
});
