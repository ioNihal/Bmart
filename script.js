(() => {
  let currentPage = 1;
  const perPage = 5;
  let allProducts = [];

  document.addEventListener('DOMContentLoaded', () => {
    setupHamburger();
    loadProducts();
  });

  function setupHamburger() {
    const burger = document.getElementById('hamburger');
    const nav = document.getElementById('navLinks');
    if (burger && nav) {
      burger.addEventListener('click', () => {
        nav.classList.toggle('open');
      });
    }
  }

  async function loadProducts() {
    try {
      const res = await fetch('data/products.json');
      allProducts = await res.json();
    } catch (err) {
      console.error('Failed to load products:', err);
      return;
    }

    if (location.pathname.endsWith('product.html')) {
      renderDetailPage();
    } else {
      renderPage(currentPage);
      renderPagination();
    }
  }

  function renderPage(page) {
    const start = (page - 1) * perPage;
    const items = allProducts.slice(start, start + perPage);
    const grid = document.getElementById('productGrid');
    grid.innerHTML = items.map(p => `
      <div class="product-card">
        <a href="product.html?id=${encodeURIComponent(p.id)}">
          <img src="${p.imageUrl}" alt="${p.name}" loading="lazy" class="skeleton-img" onload="this.classList.remove('skeleton-img')">
          <div class="overlay">View details</div>
          <h4>${p.name}</h4>
          <p>${p.shortDesc}</p>
        </a>
      </div>
    `).join('');
  }

  function renderPagination() {
    const total = Math.ceil(allProducts.length / perPage);
    const pg = document.getElementById('pagination');
    pg.innerHTML = Array.from({ length: total }, (_, i) =>
      `<button type="button" data-page="${i + 1}">${i + 1}</button>`
    ).join('');

    pg.addEventListener('click', e => {
      const btn = e.target.closest('button[data-page]');
      if (!btn) return;
      goToPage(Number(btn.dataset.page));
    });
  }

  function goToPage(n) {
    currentPage = n;
    renderPage(n);
    window.scrollTo({ top: document.getElementById('products').offsetTop, behavior: 'smooth' });
  }

  function renderDetailPage() {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    const product = allProducts.find(p => String(p.id) === id);
    const container = document.getElementById('productDetail');

    if (!product) {
      container.innerHTML = '<p>Product not found.</p>';
      return;
    }

    container.innerHTML = `
      <a href="index.html#products" class="back-btn">Back</a>
      <div class="product-detail-wrapper">
      <div class="product-image">
      <img src="${product.imageUrl}" alt="${product.name}" loading="lazy" class="skeleton-img" onload="this.classList.remove('skeleton-img')">
      </div>
      <div class="product-info">
      <h2>${product.name}</h2>
      <p class="product-description">${product.fullDesc}</p>
      <p class="price">Price: <strong>$${product.price}</strong></p>
      <div class="product-actions">
      <button id="shareBtn" class="btn share-btn">Share</button>
      <a href="index.html#products" class="btn back-btn-alt">Back to Products</a>
      </div>
      </div>
      </div>
    `;

    document.getElementById('shareBtn').addEventListener('click', () => {
      const btn = document.getElementById('shareBtn');

      navigator.clipboard.writeText(location.href)
        .then(() => {
          btn.textContent = "Copied!";
          setTimeout(() => {
            btn.textContent = "Share";
          }, 2000);
        })
        .catch(err => {
          console.error('Copy failed', err);
        });
    });

  }
})();
