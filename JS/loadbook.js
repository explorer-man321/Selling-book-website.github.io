document.addEventListener('DOMContentLoaded', function () {
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    function formatPrice(value) {
        const n = Number(value);
        return Number.isFinite(n) ? n.toLocaleString('vi-VN') + ' VNĐ' : 'N/A';
    }

    function setText(id, text) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = text;
        }
    }

    function renderNotFound() {
        setText('book-title', 'Không tìm thấy sách');
        setText('book-author', 'N/A');
        setText('book-price', 'N/A');
        setText('book-old-price', 'N/A');
        setText('savings-note', 'Không tìm thấy dữ liệu sách phù hợp.');
    }

    function renderInfoTable(book) {
        const table = document.getElementById('info_table');
        if (!table) {
            return;
        }

        const rows = [
            ['Mã hàng', book['Mã hàng']],
            ['Tên nhà cung cấp', book['Tên Nhà Cung Cấp']],
            ['Tác giả', book['Tác giả'] || book.author],
            ['Người dịch', book['Người Dịch'] || 'N/A'],
            ['NXB', book['NXB']],
            ['Năm XB', book['Năm XB']],
            ['Ngôn ngữ', book['Ngôn Ngữ'] || 'Tiếng Việt'],
            ['Trọng lượng (gr)', book['Trọng lượng (gr)']],
            ['Kích thước bao bì', book['Kích Thước Bao Bì']],
            ['Số trang', book['Số trang']],
            ['Hình thức', book['Hình thức']],
            ['Sản phẩm bán chạy nhất', book['Sản phẩm bán chạy nhất']]
        ];

        const tbody = table.querySelector('tbody');
        if (!tbody) {
            return;
        }

        tbody.innerHTML = rows
            .filter(function (row) { return row[1]; })
            .map(function (row, index, allRows) {
                const isLast = index === allRows.length - 1;
                const borderClass = isLast ? '' : ' class="border-bottom"';
                return '<tr' + borderClass + '><td class="fw-bold">' + row[0] + '</td><td class="text-muted" style="font-size: 13px;">' + row[1] + '</td></tr>';
            })
            .join('');
    }

    function setupActions(book) {
        const quantityInput = document.getElementById('quantity-input');
        const decrementBtn = document.getElementById('decrement-btn');
        const incrementBtn = document.getElementById('increment-btn');
        const addToCartBtn = document.getElementById('add-to-cart-btn');
        const buyNowBtn = document.getElementById('buy-now-btn');

        if (quantityInput && decrementBtn) {
            decrementBtn.addEventListener('click', function () {
                const val = parseInt(quantityInput.value, 10) || 1;
                quantityInput.value = String(Math.max(1, val - 1));
            });
        }

        if (quantityInput && incrementBtn) {
            incrementBtn.addEventListener('click', function () {
                const val = parseInt(quantityInput.value, 10) || 1;
                quantityInput.value = String(val + 1);
            });
        }

        if (addToCartBtn && quantityInput) {
            addToCartBtn.addEventListener('click', function () {
                const qty = parseInt(quantityInput.value, 10) || 1;
                if (typeof addToCart === 'function') {
                    addToCart(book.id, qty);
                } else {
                    alert('addToCart function not found!');
                }
            });
        }

        if (buyNowBtn) {
            buyNowBtn.addEventListener('click', function () {
                if (typeof addToCart === 'function') {
                    addToCart(book.id, 1);
                    window.location.href = '/HTML/checkout.html';
                } else {
                    alert('addToCart function not found!');
                }
            });
        }
    }

    const bookId = getQueryParam('id');
    if (!bookId) {
        renderNotFound();
        return;
    }

    fetch('../book.json')
        .then(function (response) { return response.json(); })
        .then(function (data) {
            const books = Array.isArray(data) ? data : (data.books || []);
            const book = books.find(function (b) { return String(b.id) === String(bookId); });

            if (!book) {
                renderNotFound();
                return;
            }

            const cover = document.getElementById('book-cover');
            if (cover) {
                cover.src = book.imglink || 'https://placehold.co/600x800';
                cover.alt = book.title || 'Book cover';
            }

            setText('book-title', book.title || 'N/A');
            setText('book-author', book.author || book['Tác giả'] || 'N/A');
            setText('book-price', formatPrice(book.price));

            const priceValue = Number(book.price);
            const oldPriceValue = Number(book.oldprice) || (Number.isFinite(priceValue) ? Math.round(priceValue * 1.2) : null);
            setText('book-old-price', oldPriceValue ? formatPrice(oldPriceValue) : 'N/A');

            const savingsNote = document.getElementById('savings-note');
            if (savingsNote && Number.isFinite(priceValue) && oldPriceValue) {
                const savings = Math.max(0, oldPriceValue - priceValue);
                savingsNote.innerHTML = 'Tiết kiệm <strong>' + savings.toLocaleString('vi-VN') + 'đ</strong> · Miễn phí ship đơn từ <strong>199.000đ</strong>';
            }

            const description = document.getElementById('description');
            if (description) {
                description.innerHTML = book.description || 'Không có mô tả cho sách này.';
            }

            renderInfoTable(book);
            setupActions(book);
        })
        .catch(function (err) {
            console.error('Error fetching book data:', err);
            renderNotFound();
        });
});
