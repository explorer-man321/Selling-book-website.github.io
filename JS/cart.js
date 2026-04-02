let cart = new Map();
let addToCartModalTimer = null;

function showAddToCartSuccessModal(bookTitle) {
    const modalId = 'add-to-cart-success-modal';
    let modal = document.getElementById(modalId);

    if (!modal) {
        modal = document.createElement('div');
        modal.id = modalId;
        modal.style.position = 'fixed';
        modal.style.top = '24px';
        modal.style.left = '50%';
        modal.style.transform = 'translateX(-50%)';
        modal.style.zIndex = '9999';
        modal.style.background = '#198754';
        modal.style.color = '#fff';
        modal.style.padding = '12px 20px';
        modal.style.borderRadius = '10px';
        modal.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
        modal.style.fontSize = '14px';
        modal.style.fontWeight = '600';
        modal.style.opacity = '0';
        modal.style.transition = 'opacity 0.2s ease';
        modal.style.pointerEvents = 'none';
        document.body.appendChild(modal);
    }

    modal.innerText = `Đã thêm "${bookTitle}" vào giỏ hàng!`;
    modal.style.opacity = '1';

    if (addToCartModalTimer) {
        clearTimeout(addToCartModalTimer);
    }

    addToCartModalTimer = setTimeout(() => {
        modal.style.opacity = '0';
    }, 1000);
}

function loadBook(bookId, callback) {
    fetch('../book.json')
        .then(response => response.json())
        .then(books => {
            const book = books.find(b => Number(b.id) === Number(bookId));
            if (typeof callback === 'function') callback(book);
        })
        .catch(error => {
            console.error('Lỗi khi load book:', error);
            if (typeof callback === 'function') callback(null);
        });
}

function loadCart() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        const obj = JSON.parse(storedCart);
        cart = new Map(Object.entries(obj).map(([id, qty]) => [Number(id), qty]));
    }
    updateCartCount();
}

function saveCart() {
    const obj = Object.fromEntries(cart);
    localStorage.setItem('cart', JSON.stringify(obj));
    updateCartCount();
}

function updateCartCount() {
    const count = Array.from(cart.values()).reduce((a, b) => a + b, 0);
    document.querySelectorAll('.cart-count-badge').forEach(badge => {
        badge.innerText = count;
    });
}

function addToCart(bookId, quantity = 1) {
    const book = books.find(b => b.id == bookId);
    if (book) {
        cart.set(bookId, (cart.get(bookId) || 0) + quantity);
        saveCart();
        showAddToCartSuccessModal(book.title);
    }
}

function clearCart() {
    cart.clear();
    saveCart();
    updateCartCount();
}

function getCartItems() {
    return Array.from(cart.entries()).map(([bookId, quantity]) => ({bookId: Number(bookId), quantity}));
}

function showCart() {
    window.location.href = 'checkout.html';
}

loadCart();