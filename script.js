let currentPage = 1;
const perPage = 6;
let allProducts = [];

// 1) load & render
async function loadProducts() {
  const res = await fetch('public/data/products.json');
  allProducts = await res.json();
  console.log(allProducts);
  renderPage(currentPage);
  renderPagination();
}

// 2) render the grid into the element with class .products-grid
function renderPage(page) {
  const start = (page - 1) * perPage;
  const pageItems = allProducts.slice(start, start + perPage);
  const grid = document.querySelector('.products-grid');
  grid.innerHTML = pageItems
    .map(
      p => `
    <div class="product-card" onclick="showDetail(${p.id})">
      <img src="${p.imageUrl}" alt="${p.name}">
      <h4>${p.name}</h4>
      <p>${p.shortDesc}</p>
    </div>`
    )
    .join('');
}

// 3) render page-buttons into the element with class .pagination
function renderPagination() {
  const totalPages = Math.ceil(allProducts.length / perPage);
  const pagEl = document.querySelector('.pagination');
  pagEl.innerHTML = Array.from({ length: totalPages }, (_, i) =>
    `<button onclick="goToPage(${i + 1})">${i + 1}</button>`
  ).join('');
}

function goToPage(n) {
  currentPage = n;
  renderPage(n);
}

// 4) show detail inside the modal-content (which now also has .product-detail)
function showDetail(id) {
  const p = allProducts.find(x => x.id === id);
  const detail = document.querySelector('.product-detail');
  detail.innerHTML = `
    <button class="close-btn" id="closeBtn">← Back</button>
    <h2>${p.name}</h2>
    <img src="${p.imageUrl}" alt="${p.name}">
    <p>${p.fullDesc}</p>
    <p>Price: $${p.price}</p>
  `;
  // display the modal
  document.getElementById('modal').style.display = 'flex';
  // re-attach the close handler to the newly rendered button
  detail.querySelector('#closeBtn').addEventListener('click', closeDetail);
}

function closeDetail() {
  document.getElementById('modal').style.display = 'none';
}

// 5) kick everything off
document.addEventListener('DOMContentLoaded', loadProducts);
