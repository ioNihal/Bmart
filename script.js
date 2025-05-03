let currentPage = 1,
    perPage     = 6,
    allProducts = [];

// Wrap all DOM‑dependent wiring in DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  // hamburger toggle (guarded)
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // load & render for index or detail
  loadProducts();
});


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


// index: render grid of cards linking to product.html?id=<id>
function renderPage(page) {
  const start = (page - 1) * perPage;
  const items = allProducts.slice(start, start + perPage);
  const grid  = document.querySelector('.products-grid');
  grid.innerHTML = items.map(p => `
    <a class="product-card" href="product.html?id=${p.id}">
      <img src="${p.imageUrl}" alt="${p.name}">
      <h4>${p.name}</h4>
      <p>${p.shortDesc}</p>
    </a>
  `).join('');
}

function renderPagination() {
  const total = Math.ceil(allProducts.length / perPage);
  const pg    = document.querySelector('.pagination');
  pg.innerHTML = Array.from({ length: total }, (_, i) =>
    `<button onclick="goToPage(${i + 1})">${i + 1}</button>`
  ).join('');
}

function goToPage(n) {
  currentPage = n;
  renderPage(n);
}


// product.html: parse ID & render detail + share
function renderDetailPage() {
  const params    = new URLSearchParams(window.location.search);
  const id        = parseInt(params.get('id'));
  const p         = allProducts.find(x => x.id === id);
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

  // share-button wiring
  document.getElementById('shareBtn').addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert('Link copied to clipboard!'))
      .catch(err => console.error('Copy failed', err));
  });
}