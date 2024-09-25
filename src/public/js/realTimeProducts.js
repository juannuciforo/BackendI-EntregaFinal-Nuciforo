const socket = io();

let currentPage = 1;
const limit = 10;

const productForm = document.getElementById('addProductForm');
const productList = document.getElementById('productList');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const currentPageSpan = document.getElementById('currentPage');

productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const productData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        code: document.getElementById('code').value,
        price: document.getElementById('price').value,
        stock: document.getElementById('stock').value,
    };
    socket.emit('addProduct', productData);
    productForm.reset();
});

socket.on('updateProducts', (data) => {
    updateProductList(data.products);
    updatePagination(data.pagination);
});

socket.on('productAdded', (product) => {
    alert(`Producto "${product.title}" agregado exitosamente.`);
});

socket.on('productDeleted', (productId) => {
    alert(`Producto eliminado exitosamente.`);
});

socket.on('productError', (errorMessage) => {
    alert(`Error: ${errorMessage}`);
});

function updateProductList(products) {
    productList.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product._id}">
            <h2>${product.title}</h2>
            <p>${product.description}</p>
            <p>Precio: $${product.price}</p>
            <p>Stock: ${product.stock}</p>
            <button class="deleteProduct" data-id="${product._id}">Eliminar</button>
        </div>
    `).join('');

    document.querySelectorAll('.deleteProduct').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            socket.emit('deleteProduct', productId);
        });
    });
}

function updatePagination(pagination) {
    currentPage = pagination.page;
    currentPageSpan.textContent = `Página ${currentPage} de ${pagination.totalPages}`;
    prevPageBtn.disabled = !pagination.hasPrevPage;
    nextPageBtn.disabled = !pagination.hasNextPage;
}

prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        socket.emit('requestProducts', { page: currentPage, limit });
    }
});

nextPageBtn.addEventListener('click', () => {
    currentPage++;
    socket.emit('requestProducts', { page: currentPage, limit });
});

// Solicitar productos iniciales
socket.emit('requestProducts', { page: currentPage, limit });