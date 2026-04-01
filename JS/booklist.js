books = [];
currating = 5;
curminPrice = 0;
curmaxPrice = Infinity;
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

function loadBook() {
    category = getQueryParam('category')?.trim().toLowerCase() || null;

    fetch('../book.json')
        .then(response => response.json())
        .then(data => {
            const filteredBooks = category
                ? data.filter(book => book.category === category)
                : data;

            books = filteredBooks;
            window.books = filteredBooks;
            displayBooks(filteredBooks);
        })
        .catch(error => {
            console.error('Lỗi khi tải book.json:', error);
            const bookList = document.getElementById('book-list');
            if (bookList) {
                bookList.innerHTML = '<div class="alert alert-danger">Không thể tải sách. Vui lòng thử lại sau.</div>';
            }
        });
}

function displayBooks(books) {
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
                <div class="card h-100 shadow-sm ">
                    <a href="/HTML/detail_page.html?id=${book.id}" class="book-img">
                        <img src="${book.imglink}" class="card-img-top" alt="${book.title}" style="height: 300px !important; object-fit: cover;">
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

function showbookbyprice(books, minPrice, maxPrice) {
    const bookList = document.getElementById('book-list');
    if (!bookList) return;

    const filteredBooks = books.filter(book => book.price >= minPrice && book.price <= maxPrice);

    bookList.innerHTML = '';

    return filteredBooks;
}

function sortBooks(books, sortBy) {

    const bookList = document.getElementById('book-list');
    if (!bookList) return;

    const selectedSort = sortBy || document.getElementById('sort-by')?.value || '';
    let sortedBooks = books.slice();

    switch (selectedSort) {
        case 'price-asc':
            sortedBooks.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sortedBooks.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            sortedBooks.sort((a, b) => b.id - a.id);
            break;
        case 'oldest':
            sortedBooks.sort((a, b) => a.id - b.id);
            break;
        case 'title-asc':
            sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'title-desc':
            sortedBooks.sort((a, b) => b.title.localeCompare(a.title));
            break;
        default:
            sortedBooks.sort((a, b) => a.id - b.id);
    }

    return sortedBooks;
}

function showbyrating(books, rating) {
    const bookList = document.getElementById('book-list');
    if (!bookList) return;

    const filteredBooks = books.filter(book => book.rating <= rating);

    return filteredBooks;
}

function changepricefilter(minPrice, maxPrice) {
    curminPrice = minPrice;
    curmaxPrice = maxPrice;

    applyFilters();
}

function changeRatingFilter(rating) {
    currating = rating;
    applyFilters();
}

function changeSortBy(sortBy) {
    cursortBy = sortBy;
    applyFilters();
}

function applyFilters() {
    let filteredBooks = window.books || [];
    if (curminPrice !== 0 || curmaxPrice !== Infinity) {
        filteredBooks = showbookbyprice(filteredBooks, curminPrice, curmaxPrice);
    }
    if (currating !== 5) {
        filteredBooks = showbyrating(filteredBooks, currating);
    }
    sortBy = document.getElementById('sort-by')?.value || 'default';
    filteredBooks = sortBooks(filteredBooks, sortBy);
    displayBooks(filteredBooks);
}

function clearfilter() {
    const priceFilters = document.querySelectorAll('.price-filter');
    priceFilters.forEach(filter => filter.checked = false);
    const ratingFilters = document.querySelectorAll('.rating-filter');
    ratingFilters.forEach(filter => filter.checked = false);
    showbookbyprice(window.books || [], 0, Infinity);
    sortBooks(window.books || [], 'default');
    const sortBySelect = document.getElementById('sort-by');
    if (sortBySelect) {
        sortBySelect.value = '';
    }
    displayBooks(window.books || []);
}


loadBook();