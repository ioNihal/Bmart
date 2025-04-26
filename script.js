let currentPage = 1;
  const perPage = 6;
  let allProducts = [];

  async function loadProducts() {
    const res = await fetch('mock-data/products.json');
    allProducts = await res.json();
    renderPage(currentPage);
    renderPagination();
  }

  function renderPage(page) {
    const start = (page-1)*perPage;
    const pageItems = allProducts.slice(start, start+perPage);
    const grid = document.querySelector('.products-grid');
    grid.innerHTML = pageItems.map(p=>`
      <div class="product-card" onclick="showDetail(${p.id})">
        <img src="${p.imageUrl}" alt="${p.name}">
        <h4>${p.name}</h4>
        <p>${p.shortDesc}</p>
      </div>
    `).join('');
  }

  function renderPagination() {
    const totalPages = Math.ceil(allProducts.length / perPage);
    const pagEl = document.querySelector('.pagination');
    pagEl.innerHTML = Array.from({length:totalPages},(_,i)=>
      `<button onclick="goToPage(${i+1})">${i+1}</button>`
    ).join('');
  }

  function goToPage(n) {
    currentPage = n;
    renderPage(n);
  }

  function showDetail(id) {
    const p = allProducts.find(x=>x.id===id);
    const detail = document.querySelector('.product-detail');
    detail.innerHTML = `
      <button onclick="closeDetail()">← Back</button>
      <h2>${p.name}</h2>
      <img src="${p.imageUrl}" alt="${p.name}">
      <p>${p.fullDesc}</p>
      <p>Price: $${p.price}</p>
    `;
    detail.classList.add('visible');
  }

  function closeDetail() {
    document.querySelector('.product-detail').classList.remove('visible');
  }

  document.addEventListener('DOMContentLoaded', loadProducts);