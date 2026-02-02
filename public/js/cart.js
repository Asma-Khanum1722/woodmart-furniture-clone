document.addEventListener('DOMContentLoaded', () => {
    // State
    let cart = JSON.parse(localStorage.getItem('woodmartChart')) || [];

    // DOM Elements
    const cartIcon = document.querySelector('.cart a'); // Requires header modification
    const cartDrawer = document.getElementById('cart-drawer');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartCountElement = document.querySelector('.cart a'); // Use existing or new element
    const addToCartButtons = document.querySelectorAll('.button-1');

    // Init
    updateCartUI();

    // Event Listeners
    addToCartButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = e.target.closest('.card-1');
            const product = {
                id: card.querySelector('.curve span:first-child').innerText, // Using name as ID for now
                name: card.querySelector('.curve span:first-child').innerText,
                price: parseFloat(card.querySelector('.cost').innerText.replace(/[^0-9.]/g, '')),
                image: card.querySelector('.card-image').src,
                quantity: 1
            };
            addToCart(product);
            openCart();
        });
    });

    if (cartIcon) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            openCart();
        });
    }

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    }

    // Functions
    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push(product);
        }
        saveCart();
        updateCartUI();
    }

    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        saveCart();
        updateCartUI();
    }

    function updateQuantity(id, change) {
        const item = cart.find(item => item.id === id);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                removeFromCart(id);
            } else {
                saveCart();
                updateCartUI();
            }
        }
    }

    function saveCart() {
        localStorage.setItem('woodmartChart', JSON.stringify(cart));
    }

    function updateCartUI() {
        // Update Count
        const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalCost = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Update Header Text (Simple replace for now)
        const cartHeader = document.querySelector('.cart a');
        if (cartHeader) {
            cartHeader.innerHTML = `<i class="icon bi bi-cart3"></i> $${totalCost.toFixed(2)}`;
        }

        // Render Items
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '';
            cart.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = 'cart-item';
                itemEl.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>$${item.price.toFixed(2)}</p>
                        <div class="cart-controls">
                            <button onclick="window.updateCartQuantity('${item.id}', -1)">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="window.updateCartQuantity('${item.id}', 1)">+</button>
                        </div>
                    </div>
                    <button class="remove-btn" onclick="window.removeCartItem('${item.id}')">&times;</button>
                `;
                cartItemsContainer.appendChild(itemEl);
            });
        }

        if (cartTotalElement) {
            cartTotalElement.innerText = `$${totalCost.toFixed(2)}`;
        }
    }

    function openCart() {
        if (cartDrawer) cartDrawer.classList.add('active');
        const overlay = document.getElementById('menu-overlay');
        if (overlay) {
            overlay.classList.add('active');
            // Ensure clicking overlay closes cart
            overlay.onclick = closeCart;
        }
        document.body.style.overflow = 'hidden';
    }

    function closeCart() {
        if (cartDrawer) cartDrawer.classList.remove('active');
        const overlay = document.getElementById('menu-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
        document.body.style.overflow = '';
    }

    // Global Exposure for inline onclicks
    window.removeCartItem = removeFromCart;
    window.updateCartQuantity = updateQuantity;
});
