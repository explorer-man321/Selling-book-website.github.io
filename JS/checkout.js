function formatCurrency(value) {
    return value.toLocaleString('vi-VN') + ' VNĐ';
}

function buildCartTable(items) {
    if (!items.length) {
        return '<div class="alert alert-warning">Giỏ hàng của bạn đang trống.</div>';
    }

    let totalPrice = 0;
    let rows = items.map(({book, quantity}) => {
        const itemTotal = book.price * quantity;
        totalPrice += itemTotal;
        return `
            <tr>
                <td>${book.title}</td>
                <td>${quantity}</td>
                <td>${formatCurrency(book.price)}</td>
                <td>${formatCurrency(itemTotal)}</td>
            </tr>
        `;
    }).join('');

    return `
        <div class="table-responsive mb-4">
            <table class="table table-bordered">
                <thead class="table-light">
                    <tr>
                        <th>Sản phẩm</th>
                        <th>Số lượng</th>
                        <th>Giá</th>
                        <th>Thành tiền</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
                <tfoot>
                    <tr>
                        <th colspan="3" class="text-end">Tổng</th>
                        <th>${formatCurrency(totalPrice)}</th>
                    </tr>
                </tfoot>
            </table>
        </div>
    `;
}

function renderCheckoutPage() {
    const cartItems = getCartItems();
    const cartSummaryEl = document.getElementById('cart-summary');
    const messageEl = document.getElementById('checkout-message');
    const formEl = document.getElementById('checkout-form');

    if (!cartSummaryEl || !formEl || !messageEl) {
        return;
    }

    if (cartItems.length === 0) {
        cartSummaryEl.innerHTML = '<div class="alert alert-warning">Giỏ hàng của bạn đang trống. Vui lòng quay lại <a href="booklist.html">mua sách</a>.</div>';
        formEl.style.display = 'none';
        return;
    }

    fetch('../book.json')
        .then(resp => resp.json())
        .then(books => {
            const detailedItems = cartItems
                .map(item => ({book: books.find(b => Number(b.id) === Number(item.bookId)), quantity: item.quantity}))
                .filter(item => item.book);

            cartSummaryEl.innerHTML = buildCartTable(detailedItems);

            formEl.addEventListener('submit', function (event) {
                event.preventDefault();
                event.stopPropagation();

                formEl.classList.add('was-validated');
                if (!formEl.checkValidity()) {
                    return;
                }

                const customerName = document.getElementById('customerName').value.trim();
                const customerEmail = document.getElementById('customerEmail').value.trim();
                const customerAddress = document.getElementById('customerAddress').value.trim();

                if (!customerName || !customerEmail || !customerAddress) {
                    return;
                }

                clearCart();
                cartSummaryEl.innerHTML = '<div class="alert alert-success">Đặt hàng thành công! Cảm ơn bạn đã mua sắm.</div>';
                messageEl.classList.remove('d-none', 'alert-info');
                messageEl.classList.add('alert-success');
                const totalAmount = detailedItems.reduce((sum, i) => sum + i.book.price * i.quantity, 0);
                messageEl.innerText = `Xin chào ${customerName}, đơn hàng của bạn đã được xử lý. Tổng ${totalAmount.toLocaleString('vi-VN')} VNĐ.`;

                formEl.reset();
                formEl.style.display = 'none';

                setTimeout(() => {
                    window.location.href = 'booklist.html';
                }, 2000);
            }, { once: true });
        });
}

document.addEventListener('DOMContentLoaded', renderCheckoutPage);