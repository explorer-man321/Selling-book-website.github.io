books = [];

function loadBook(callback) {
    fetch('../book.json')
        .then(response => response.json())
        .then(data => {
            books = data;
            window.books = data;
            if (typeof callback === 'function') {
                callback();
            }
        })
        .catch(error => {
            console.error('Lỗi khi tải book.json:', error);
            const bookList = document.getElementById('book-list');
            if (bookList) {
                bookList.innerHTML = '<div class="alert alert-danger">Không thể tải sách. Vui lòng thử lại sau.</div>';
            }
        });
}

function displayBooks() {
    const bookList = document.getElementById('book-list');
    if (!bookList) return;

    if (!window.books || !window.books.length) {
        bookList.innerHTML = '<div class="alert alert-warning">Không có sách nào để hiển thị.</div>';
        return;
    }

    bookList.innerHTML = '';
    books.forEach(book => {
        const bookCard = `
            <div class="col-md-3 mb-4">
                <div class="card h-100 shadow-sm">
                    <a href="book?id=${book.id}">
                        <img src="https://placehold.co/1000x1000" class="card-img-top" alt="${book.title}">
                    </a>
                    <div class="card-body">
                        <a href="book?id=${book.id}" style="color: black; text-decoration: none;">
                            <h5 class="card-title" style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${book.title}</h5>
                        </a>
                        <p class="card-text text-danger fw-bold">${book.price.toLocaleString('vi-VN')} VNĐ</p>
                        <button class="btn btn-success w-100" onclick="addToCart(${book.id})">Thêm vào giỏ</button>
                    </div>
                </div>
            </div>
        `;
        bookList.innerHTML += bookCard;
    });
}

loadBook(displayBooks);