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
            document.getElementById('book-detail-container').innerHTML = `
                <div class="col-md-6 offset-md-3">
                    <div class="card mb-3">
                        <img src="${book.imglink || 'https://placehold.co/600x800'}" class="card-img-top" alt="${book.title}">
                        <div class="card-body">
                            <h3 class="card-title">${book.title}</h3>
                            <p class="card-text">${book.description || 'Không có mô tả.'}</p>
                            <p class="card-text text-danger fw-bold">${book.price ? book.price.toLocaleString('vi-VN') : 'N/A'} VNĐ</p>
                            <div class="input-group mb-3" style="max-width: 200px; margin: 0 auto;">
                                <button class="btn btn-outline-secondary" type="button" id="decrement-btn">-</button>
                                <input type="number" class="form-control text-center" id="quantity-input" value="1" min="1" style="max-width: 60px;">
                                <button class="btn btn-outline-secondary" type="button" id="increment-btn">+</button>
                            </div>
                            <button class="btn btn-success w-100" id="add-to-cart-btn">Thêm vào giỏ</button>
                        </div>
                    </div>
                </div>
            `;
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
                if (typeof addToCart === 'function') {
                    addToCart(book.id, qty);
                } else {
                    alert('addToCart function not found!');
                }
            });
        })
        .catch(err => {
            document.getElementById('book-detail-container').innerHTML = '<div class="col-12 text-center text-danger">Lỗi tải dữ liệu sách!</div>';
        });
});
