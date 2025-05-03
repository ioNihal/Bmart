let currentPage = 1,
    perPage = 6,
    allProducts = [];

// hamburger toggle
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});

// load & render for index or detail
async function loadProducts() {
  const res = await fetch('public/data/products.json');
  allProducts = await res.json();

  if (window.location.pathname.endsWith('product.html')) {
    renderDetailPage();
  } else {
    renderPage(currentPage);
    renderPagination();
  }
}

// index: render grid
function renderPage(page) {
  const start = (page - 1) * perPage;
  const items = allProducts.slice(start, start + perPage);
  document.querySelector('.products-grid').innerHTML = items.map(p => `
    <a class="product-card" href="product.html?id=${p.id}">
      <img src="${p.imageUrl}" alt="${p.name}">
      <h4>${p.name}</h4>
      <p>${p.shortDesc}</p>
    </a>
  `).join('');
}

function renderPagination() {
  const total = Math.ceil(allProducts.length / perPage);
  document.querySelector('.pagination').innerHTML =
    Array.from({ length: total }, (_, i) => `<button onclick="goToPage(${i + 1})">${i + 1}</button>`).join('');
}

function goToPage(n) {
  currentPage = n;
  renderPage(n);
}

// detail: parse ID & render
function renderDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  const p = allProducts.find(x => x.id === id);
  const container = document.getElementById('productDetail');

  if (!p) {
    container.innerHTML = '<p>Product not found.</p>';
    return;
  }

  container.innerHTML = `
    <button onclick="window.history.back()" class="close-btn">← Back</button>
    <h2>${p.name}</h2>
    <img src="${p.imageUrl}" alt="${p.name}">
    <p>${p.fullDesc}</p>
    <p><strong>Price:</strong> $${p.price}</p>
    <button id="shareBtn">Share</button>
  `;

  document.getElementById('shareBtn').addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert('Link copied to clipboard!'))
      .catch(err => console.error('Copy failed', err));
  });
}

document.addEventListener('DOMContentLoaded', loadProducts);