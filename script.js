const books = [
  {
    id: 1,
    title: 'The Silent Horizon',
    author: 'Aidan Brooks',
    category: 'fiction',
    price: 24.99,
    description:
      'A deeply atmospheric novel about second chances, lost memories, and the quiet courage it takes to begin again.',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80',
    badge: 'Bestseller'
  },
  {
    id: 2,
    title: 'The Algorithm Awakens',
    author: 'Mira Chen',
    category: 'technology',
    price: 32.5,
    description:
      'Explore the next generation of AI, automation, and connected systems through a compelling narrative and practical insights.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
    badge: 'New'
  },
  {
    id: 3,
    title: 'Learning to Lead',
    author: 'Nina Patel',
    category: 'education',
    price: 19.75,
    description:
      'A practical guide for students and educators who want to build confidence, curiosity, and impact in modern learning environments.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
    badge: 'Popular'
  },
  {
    id: 4,
    title: 'Daily Momentum',
    author: 'Elena Ross',
    category: 'self-development',
    price: 21.0,
    description:
      'Build sustainable habits, improve focus, and transform ordinary routines into meaningful progress with this motivating read.',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80',
    badge: 'Trending'
  },
  {
    id: 5,
    title: 'Ink & Ashes',
    author: 'Sofia Maren',
    category: 'fiction',
    price: 28.4,
    description:
      'A riveting story of family, ambition, and resilience set against the backdrop of a city in transition.',
    image: 'https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=900&q=80',
    badge: 'Awarded'
  },
  {
    id: 6,
    title: 'Cloud Craft',
    author: 'David Kim',
    category: 'technology',
    price: 34.9,
    description:
      'A concise and engaging overview of cloud architecture, DevOps patterns, and building resilient digital products.',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=900&q=80',
    badge: 'Top Rated'
  },
  {
    id: 7,
    title: 'The School of Curiosity',
    author: 'Harper Wells',
    category: 'education',
    price: 18.99,
    description:
      'Discover how curiosity unlocks deeper learning, stronger communities, and brighter classroom experiences.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80',
    badge: 'Best Seller'
  },
  {
    id: 8,
    title: 'Purpose in Motion',
    author: 'Liam Foster',
    category: 'self-development',
    price: 26.15,
    description:
      'Find clarity, direction, and sustainable motivation through a thoughtful plan for living with intention and energy.',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80',
    badge: 'Editor Pick'
  }
];

const categoryOrder = ['all', 'fiction', 'technology', 'education', 'self-development'];

const state = {
  activeCategory: 'all',
  searchTerm: '',
  cart: []
};

const bookGrid = document.getElementById('bookGrid');
const categoryFilters = document.getElementById('categories');
const searchInput = document.getElementById('searchInput');
const cartPanel = document.getElementById('cartPanel');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const resultsCount = document.getElementById('resultsCount');
const bookModal = document.getElementById('bookModal');
const modalContent = document.getElementById('modalContent');

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
}

function renderCategories() {
  const labelMap = {
    all: 'All',
    fiction: 'Fiction',
    technology: 'Technology',
    education: 'Education',
    'self-development': 'Self Development'
  };

  categoryFilters.innerHTML = categoryOrder
    .map(
      (category) => `
        <button
          class="category-btn ${state.activeCategory === category ? 'active' : ''}"
          type="button"
          data-category="${category}"
        >
          ${labelMap[category]}
        </button>
      `
    )
    .join('');
}

function getFilteredBooks() {
  const term = state.searchTerm.trim().toLowerCase();

  return books.filter((book) => {
    const matchesCategory =
      state.activeCategory === 'all' || book.category === state.activeCategory;

    const matchesSearch =
      term === '' ||
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term);

    return matchesCategory && matchesSearch;
  });
}

function renderBooks() {
  const filteredBooks = getFilteredBooks();
  resultsCount.textContent = `${filteredBooks.length} ${filteredBooks.length === 1 ? 'book' : 'books'}`;

  if (!filteredBooks.length) {
    bookGrid.innerHTML = `
      <div class="empty-state">
        No books match your current search. Try another title or browse a different category.
      </div>
    `;
    return;
  }

  bookGrid.innerHTML = filteredBooks
    .map(
      (book) => `
        <article class="book-card" aria-label="${book.title}">
          <div class="book-cover">
            <img src="${book.image}" alt="${book.title} cover" />
            <span class="book-badge">${book.badge}</span>
          </div>
          <div class="book-info">
            <div class="book-meta">
              <span>${book.category}</span>
              <span>★ 4.8</span>
            </div>
            <h3>${book.title}</h3>
            <p class="author-name">by ${book.author}</p>
            <div class="price-row">
              <strong>${formatCurrency(book.price)}</strong>
              <div class="card-actions">
                <button class="secondary-btn" type="button" data-action="details" data-id="${book.id}">Details</button>
                <button class="primary-btn" type="button" data-action="add" data-id="${book.id}">Add to Cart</button>
              </div>
            </div>
          </div>
        </article>
      `
    )
    .join('');
}

function addToCart(bookId) {
  const existingItem = state.cart.find((item) => item.id === bookId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    state.cart.push({ id: bookId, quantity: 1 });
  }

  updateCart();
}

function getCartBooks() {
  return state.cart.map((item) => {
    const book = books.find((entry) => entry.id === item.id);
    return { ...item, book };
  });
}

function updateCart() {
  const cartBooks = getCartBooks();
  const totalItems = cartBooks.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartBooks.reduce((sum, item) => sum + item.book.price * item.quantity, 0);

  cartCount.textContent = totalItems;
  cartTotal.textContent = formatCurrency(totalPrice);

  if (!cartBooks.length) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        Your cart is empty.<br />
        Add a few great titles to get started.
      </div>
    `;
    return;
  }

  cartItems.innerHTML = cartBooks
    .map(
      ({ id, quantity, book }) => `
        <div class="cart-item">
          <img src="${book.image}" alt="${book.title} cover" />
          <div>
            <h4>${book.title}</h4>
            <p>${formatCurrency(book.price)} each</p>
            <div class="quantity-controls">
              <button type="button" data-action="decrease" data-id="${id}">−</button>
              <span>${quantity}</span>
              <button type="button" data-action="increase" data-id="${id}">+</button>
            </div>
          </div>
          <div class="item-price">
            <strong>${formatCurrency(book.price * quantity)}</strong>
            <button type="button" class="remove-item" data-action="remove" data-id="${id}">Remove</button>
          </div>
        </div>
      `
    )
    .join('');
}

function changeQuantity(bookId, delta) {
  const item = state.cart.find((entry) => entry.id === bookId);
  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    state.cart = state.cart.filter((entry) => entry.id !== bookId);
  }

  updateCart();
}

function removeFromCart(bookId) {
  state.cart = state.cart.filter((entry) => entry.id !== bookId);
  updateCart();
}

function openCart() {
  cartPanel.classList.add('is-open');
}

function closeCart() {
  cartPanel.classList.remove('is-open');
}

function showBookDetails(bookId) {
  const book = books.find((entry) => entry.id === Number(bookId));
  if (!book) return;

  modalContent.innerHTML = `
    <div class="modal-cover">
      <img src="${book.image}" alt="${book.title} cover" />
    </div>
    <div class="modal-details">
      <span class="tag">${book.category}</span>
      <h2 id="modalTitle">${book.title}</h2>
      <p class="author">by ${book.author}</p>
      <p class="description">${book.description}</p>
      <div class="detail-meta">
        <span>⭐ 4.8 rating</span>
        <span>✔ In stock</span>
        <span>📘 320 pages</span>
      </div>
      <div class="modal-price-row">
        <strong>${formatCurrency(book.price)}</strong>
        <button class="primary-btn" type="button" data-action="add" data-id="${book.id}">Add to Cart</button>
      </div>
    </div>
  `;

  bookModal.classList.remove('hidden');
  bookModal.setAttribute('aria-hidden', 'false');
}

function closeBookDetails() {
  bookModal.classList.add('hidden');
  bookModal.setAttribute('aria-hidden', 'true');
}

searchInput.addEventListener('input', (event) => {
  state.searchTerm = event.target.value;
  renderBooks();
});

categoryFilters.addEventListener('click', (event) => {
  const button = event.target.closest('[data-category]');
  if (!button) return;

  state.activeCategory = button.dataset.category;
  renderCategories();
  renderBooks();
});

bookGrid.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;

  const bookId = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === 'add') {
    addToCart(bookId);
    openCart();
  }

  if (action === 'details') {
    showBookDetails(bookId);
  }
});

cartItems.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;

  const bookId = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === 'increase') changeQuantity(bookId, 1);
  if (action === 'decrease') changeQuantity(bookId, -1);
  if (action === 'remove') removeFromCart(bookId);
});

bookModal.addEventListener('click', (event) => {
  if (event.target === bookModal) {
    closeBookDetails();
  }
});

modalContent.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;

  const bookId = Number(button.dataset.id);
  addToCart(bookId);
  closeBookDetails();
  openCart();
});

document.getElementById('cartToggle').addEventListener('click', openCart);
document.getElementById('closeCart').addEventListener('click', closeCart);
document.getElementById('closeModal').addEventListener('click', closeBookDetails);

renderCategories();
renderBooks();
updateCart();
