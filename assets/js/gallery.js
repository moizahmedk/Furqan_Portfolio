
const galleryGrid = document.getElementById('gallery-grid');
const filterSearch = document.getElementById('filter-search');
const filterCategory = document.getElementById('filter-category');
const galleryCount = document.getElementById('gallery-count');
let galleryPhotos = [];

const createCard = (photo) => {
  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML = `
    <img src="${photo.image}" alt="${photo.title}">
    <div class="card-body">
      <h3>${photo.title}</h3>
      <p>${photo.description}</p>
      <div class="card-footer">
        <span>${photo.category}</span>
        <a href="photo.html?id=${photo.id}">View details</a>
      </div>
    </div>
  `;
  return card;
};

const updateGalleryCount = (count) => {
  if (galleryCount) {
    galleryCount.textContent = `${count} item${count === 1 ? '' : 's'}`;
  }
};

const renderCards = (photos) => {
  if (!galleryGrid) return;
  galleryGrid.innerHTML = '';
  if (!photos.length) {
    galleryGrid.innerHTML = '<p class="error-text">No photos match that search. Try another keyword.</p>';
    updateGalleryCount(0);
    return;
  }

  photos.forEach((photo) => galleryGrid.appendChild(createCard(photo)));
  updateGalleryCount(photos.length);
};

const getCategories = (photos) => {
  const categories = Array.from(new Set(photos.map((photo) => photo.category))).sort();
  return categories;
};

const buildCategoryOptions = (categories) => {
  if (!filterCategory) return;
  filterCategory.innerHTML = '<option value="">All categories</option>' + categories.map((category) => `<option value="${category}">${category}</option>`).join('');
};

const applyFilters = () => {
  const query = filterSearch?.value.trim().toLowerCase() || '';
  const category = filterCategory?.value || '';

  const filtered = galleryPhotos.filter((photo) => {
    const matchesQuery = [photo.title, photo.description, photo.category].some((value) => value.toLowerCase().includes(query));
    const matchesCategory = category ? photo.category === category : true;
    return matchesQuery && matchesCategory;
  });

  renderCards(filtered);
};

fetch('data/photos.json')
  .then((response) => response.json())
  .then((photos) => {
    galleryPhotos = photos.slice().sort((a, b) => (a.date < b.date ? 1 : -1));
    renderCards(galleryPhotos);
    buildCategoryOptions(getCategories(galleryPhotos));
  })
  .catch(() => {
    if (galleryGrid) {
      galleryGrid.innerHTML = '<p class="error-text">Unable to load gallery data. Open this page through a local server or use Live Server in VS Code.</p>';
    }
  });

filterSearch?.addEventListener('input', applyFilters);
filterCategory?.addEventListener('change', applyFilters);
