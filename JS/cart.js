let cart = new Map();

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
        updateCartCount();
        alert('Đã thêm sách vào giỏ hàng! ' + book.title);
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