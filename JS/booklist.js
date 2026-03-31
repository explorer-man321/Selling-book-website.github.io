books = [];
category = null;

const categoryMap = new Map([
    ['vanhoc', 'Văn học'],
    ['thieunhi', 'Thiếu nhi'],
    ['kinhte', 'Kinh tế'],
    ['giaokhoa', 'Giáo khoa'],
    ['ngoaingu', 'Ngoại ngữ'],
    ['tamly', 'Tâm lý']
]);


function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function loadBook(callback) {
    category = getQueryParam('category');

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
    const categoryEl = document.getElementById('category');

    if (categoryEl && category) {
        categoryEl.innerHTML = `<h2 class="mb-4">${category ? `Danh mục: ${categoryMap.get(category) || category}` : 'Tất cả sách'}</h2>`;
    }
    if (!bookList) return;

    if (!window.books || !window.books.length) {
        bookList.innerHTML = '<div class="alert alert-warning">Không có sách nào để hiển thị.</div>';
        return;
    }

    bookList.innerHTML = '';
    books.forEach(book => {
        if (category && book.category !== category) {
            return;
        }
        const bookCard = `
            <div class="col-md-3 mb-4" style="padding: 2px;">
                <div class="card h-100 shadow-sm">
                    <a href="/HTML/detail_page.html?id=${book.id}">
                        <img src="${book.imglink}" class="card-img-top" alt="${book.title}" style="height: 300px; object-fit: cover;">
                    </a>
                    <div class="card-body">
                        <a href="/HTML/detail_page.html?id=${book.id}" style="color: black; text-decoration: none;">
                            <h5 class="card-title" style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${book.title}</h5>
                        </a>
                        <p class="card-text text-danger fw-bold">${book.price.toLocaleString('vi-VN')} VNĐ</p>
                        <button class="btn btn-first w-100" onclick="addToCart(${book.id})">Thêm vào giỏ</button>
                    </div>
                </div>
            </div>
        `;
        bookList.innerHTML += bookCard;
    });
}

loadBook(displayBooks);