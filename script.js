let currentPage = 1, perPage = 6, allProducts = [];

// hamburger toggle
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});

// load & render
async function loadProducts() {
  const res = await fetch('public/data/products.json');
  allProducts = await res.json();
  renderPage(currentPage);
  renderPagination();
}

function renderPage(page) {
  const start = (page - 1) * perPage;
  const items = allProducts.slice(start, start + perPage);
  document.querySelector('.products-grid').innerHTML = items.map(p => `
    <div class="product-card" onclick="showDetail(${p.id})">
      <img src="${p.imageUrl}" alt="${p.name}">
      <h4>${p.name}</h4>
      <p>${p.shortDesc}</p>
    </div>`).join('');
}

function renderPagination() {
  const total = Math.ceil(allProducts.length / perPage);
  document.querySelector('.pagination').innerHTML =
    Array.from({ length: total }, (_, i) => `<button onclick="goToPage(${i + 1})">${i + 1}</button>`).join('');
}

function goToPage(n) {
  currentPage = n; renderPage(n);
}

function showDetail(id) {
  const p = allProducts.find(x => x.id === id);
  const detail = document.querySelector('.product-detail');
  detail.innerHTML = `
    <button class="close-btn" id="closeBtn">← Back</button>
    <h2>${p.name}</h2>
    <img src="${p.imageUrl}" alt="${p.name}">
    <p>${p.fullDesc}</p>
    <p><strong>Price:</strong> $${p.price}</p>`;
  document.getElementById('modal').style.display = 'flex';
  detail.querySelector('#closeBtn').onclick = closeDetail;
}

function closeDetail() {
  document.getElementById('modal').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', loadProducts);
