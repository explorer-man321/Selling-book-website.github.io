// loadbook.js
// Loads book details based on the id in the URL and populates the book-detail-container

document.addEventListener('DOMContentLoaded', function () {
    // Helper to get query param
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    const bookId = getQueryParam('id');
    if (!bookId) {
        document.getElementById('book-detail-container').innerHTML = '<div class="col-12 text-center text-danger">Không tìm thấy sách!</div>';
        return;
    }

    // Simulate fetching book data (replace with real API call if available)
    fetch('../book.json')
        .then(response => response.json())
        .then(data => {
            const book = Array.isArray(data) ? data.find(b => b.id == bookId) : (data.books || []).find(b => b.id == bookId);
            if (!book) {
                document.getElementById('book-detail-container').innerHTML = '<div class="col-12 text-center text-danger">Không tìm thấy sách!</div>';
                return;
            }

            console.log('Book data loaded:', book);

            Cover = document.getElementById("book-cover");
            if (Cover) Cover.src = book.imglink || 'https://placehold.co/600x800';

            Title = document.getElementById("book-title");
            if (Title) Title.textContent = book.title || 'N/A';

            Author = document.getElementById("book-author");
            if (Author) Author.textContent = book.author || 'N/A';

            New_price = document.getElementById("book-price");
            if (New_price) New_price.textContent = book.price ? book.price.toLocaleString('vi-VN') + ' VNĐ' : 'N/A';

            Old_price = document.getElementById("book-old-price");
            oldprice = book.oldprice || book.price ? (book.oldprice || book.price * 1.2) : null; // Giả sử old price cao hơn new price 20%
            if (Old_price) Old_price.textContent = oldprice ? oldprice.toLocaleString('vi-VN') + ' VNĐ' : 'N/A';

            Savings_note = document.getElementById("savings-note");
            if (Savings_note && book.price && oldprice) {
                const savings = oldprice - book.price;
                Savings_note.innerHTML = `Tiết kiệm <strong>${savings.toLocaleString('vi-VN')}đ</strong> · Miễn phí ship đơn từ <strong>199.000đ</strong>`;
            }

            Description = document.getElementById("description");
            if (Description) Description.innerHTML = book.description || 'Không có mô tả cho sách này.';


            // Add event listeners for quantity buttons
            const quantityInput = document.getElementById('quantity-input');
            document.getElementById('decrement-btn').addEventListener('click', function() {
                let val = parseInt(quantityInput.value, 10);
                if (val > 1) quantityInput.value = val - 1;
            });
            document.getElementById('increment-btn').addEventListener('click', function() {
                let val = parseInt(quantityInput.value, 10);
                quantityInput.value = val + 1;
            });
            document.getElementById('add-to-cart-btn').addEventListener('click', function() {
                const qty = parseInt(quantityInput.value, 10);
                // console.log(`Adding to cart: Book ID ${book.id}, Quantity ${qty}`);
                if (typeof addToCart === 'function') {
                    addToCart(book.id, qty);
                } else {
                    alert('addToCart function not found!');
                }
            });
            document.getElementById('buy-now-btn').addEventListener('click', function() {
                // console.log(`Buying now: Book ID ${book.id}`);
                if (typeof addToCart === 'function') {
                    addToCart(book.id);
                    window.location.href = '/HTML/checkout.html';
                } else {
                    alert('addToCart function not found!');
                }
            });

        })
        .catch(err => {
            console.error('Error fetching book data:', err);
        });
});

console.log('loadbook.js loaded');
