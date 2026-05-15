from pathlib import Path

base = Path(__file__).resolve().parent.parent
style = r''':root {
  color-scheme: dark;
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: #080605;
  color: #f3efe8;
  --surface: rgba(20,18,16,.72);
  --surface-strong: rgba(18,16,14,.96);
  --surface-soft: rgba(255,255,255,.06);
  --border: rgba(255,255,255,.08);
  --gold: #d4a843;
  --muted: #b8b1a6;
  --shadow: 0 35px 120px rgba(0,0,0,.25);
}

* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  min-height: 100%;
  scroll-behavior: smooth;
}

body {
  background: radial-gradient(circle at top left, rgba(212,168,67,.14), transparent 18%),
              radial-gradient(circle at 90% 20%, rgba(255,255,255,.06), transparent 20%),
              #080605;
  color: #f3efe8;
  line-height: 1.65;
}

a {
  color: inherit;
  text-decoration: none;
}

img {
  max-width: 100%;
  display: block;
}

.site-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 32px 48px;
  border-bottom: 1px solid rgba(255,255,255,.04);
  position: sticky;
  top: 0;
  backdrop-filter: blur(16px);
  background: rgba(8,6,5,.75);
  z-index: 10;
}

.brand {
  display: flex;
  align-items: center;
  gap: 18px;
}

.brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 58px;
  height: 58px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(212,168,67,.24), rgba(212,168,67,.48));
  font-size: 28px;
  font-weight: 800;
  color: #140f08;
}

.brand h1,
.brand p {
  margin: 0;
}

.brand h1 {
  font-size: clamp(24px, 2.4vw, 34px);
}

.brand p {
  color: var(--muted);
  font-size: 14px;
}

.site-nav {
  display: flex;
  gap: 22px;
  flex-wrap: wrap;
}

.site-nav a {
  color: var(--muted);
  font-size: 13px;
  letter-spacing: .14em;
  text-transform: uppercase;
  padding: 10px 0;
  transition: color .2s;
}

.site-nav a.active,
.site-nav a:hover {
  color: #fff;
}

main {
  padding: 56px 48px;
  max-width: 1280px;
  margin: 0 auto;
}

.section-header {
  margin-bottom: 30px;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-transform: uppercase;
  color: var(--gold);
  letter-spacing: .22em;
  font-size: 11px;
}

.section-header h2 {
  margin: 14px 0 0;
  font-size: clamp(30px, 4vw, 52px);
  line-height: 1.05;
}

.hero {
  display: grid;
  grid-template-columns: 1.1fr .9fr;
  gap: 40px;
  align-items: center;
  margin-bottom: 60px;
}

.hero-copy {
  max-width: 640px;
}

.hero-copy h2 {
  font-size: clamp(42px, 5vw, 70px);
  margin: 20px 0 18px;
  line-height: 1.02;
}

.hero-copy p {
  color: var(--muted);
  max-width: 620px;
  font-size: 17px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 32px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 160px;
  padding: 16px 24px;
  border-radius: 999px;
  border: 1px solid transparent;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  font-size: 12px;
  transition: transform .24s ease, background .24s ease, color .24s ease, box-shadow .24s ease;
}

.btn:hover {
  transform: translateY(-3px);
}

.btn-primary {
  background: linear-gradient(135deg, #fff0c7, #d4a843);
  color: #08110a;
  box-shadow: 0 18px 40px rgba(212,168,67,.2);
}

.btn-secondary {
  background: rgba(255,255,255,.06);
  border-color: rgba(255,255,255,.12);
  color: #fff;
}

.hero-preview {
  min-height: 460px;
  border-radius: 28px;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.09);
  overflow: hidden;
  position: relative;
}

.hero-preview::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top left, rgba(255,255,255,.12), transparent 35%);
  pointer-events: none;
}

.hero-slide {
  width: 100%;
  height: 100%;
  position: relative;
}

.hero-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity .4s ease;
}

.hero-slide-copy {
  position: absolute;
  bottom: 32px;
  left: 32px;
  max-width: 420px;
  color: #fff;
  z-index: 2;
  text-shadow: 0 24px 50px rgba(0,0,0,.35);
}

.hero-slide-copy h3 {
  margin: 12px 0 16px;
  font-size: clamp(32px, 4vw, 44px);
  line-height: 1.02;
}

.hero-slide-copy p {
  color: rgba(255,255,255,.86);
  font-size: 15px;
  line-height: 1.8;
}

.hero-slide-copy a {
  margin-top: 18px;
  display: inline-flex;
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: center;
  margin-bottom: 24px;
}

.filter-bar input,
.filter-bar select {
  flex: 1;
  min-width: 220px;
  padding: 15px 18px;
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,.12);
  background: rgba(255,255,255,.05);
  color: #fff;
}

.filter-bar input::placeholder {
  color: rgba(255,255,255,.65);
}

.gallery-count {
  color: var(--muted);
  white-space: nowrap;
  font-size: 14px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.card {
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 28px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 420px;
  transition: transform .3s ease, border-color .3s ease, box-shadow .3s ease;
  backdrop-filter: blur(10px);
}

.card:hover {
  transform: translateY(-10px);
  border-color: rgba(212,168,67,.22);
  box-shadow: 0 35px 80px rgba(0,0,0,.22);
}

.card img {
  height: 300px;
  object-fit: cover;
}

.card-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card-body h3 {
  margin: 0;
  font-size: 22px;
}

.card-body p {
  margin: 0;
  color: rgba(255,255,255,.82);
  line-height: 1.8;
  flex: 1;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  color: rgba(255,255,255,.72);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: .16em;
}

.detail-card {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 28px;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 28px;
  overflow: hidden;
}

.detail-card img {
  width: 100%;
  min-height: 520px;
  object-fit: cover;
}

.detail-card .card-body {
  padding: 40px;
}

.detail-card .card-body h2 {
  margin: 0 0 18px;
  font-size: clamp(36px, 4vw, 52px);
}

.detail-card .card-body p {
  color: rgba(255,255,255,.88);
  line-height: 1.95;
}

.section-block.about-block p,
.section-block.about-block ul {
  max-width: 720px;
}

.about-list {
  display: grid;
  gap: 12px;
  margin: 24px 0 0;
  padding-left: 18px;
  color: rgba(255,255,255,.82);
}

.about-list li {
  position: relative;
  padding-left: 18px;
}

.about-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--gold);
}

.site-footer {
  padding: 32px 48px;
  text-align: center;
  color: rgba(255,255,255,.6);
  border-top: 1px solid rgba(255,255,255,.06);
}

.error-text {
  color: #ff8f8f;
  padding: 28px;
  background: rgba(255,129,129,.08);
  border: 1px solid rgba(255,129,129,.18);
  border-radius: 22px;
}

@media (max-width: 1080px) {
  .hero {
    grid-template-columns: 1fr;
  }

  main {
    padding: 42px 32px;
  }
}

@media (max-width: 720px) {
  .site-header {
    flex-direction: column;
    align-items: stretch;
    padding: 22px 18px;
  }

  .hero-copy h2 {
    font-size: 34px;
  }

  .hero-preview {
    min-height: 320px;
  }

  .detail-card {
    grid-template-columns: 1fr;
  }

  .detail-card .card-body {
    padding: 28px;
  }

  .card img {
    height: 240px;
  }
}
'''

main_js = r'''
const galleryGrid = document.getElementById('gallery-grid');
const heroPreview = document.getElementById('hero-preview');
let heroPhotos = [];
let heroIndex = 0;

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
        <a href="photo.html?id=${photo.id}">View</a>
      </div>
    </div>
  `;
  return card;
};

const renderHeroSlide = (photo) => {
  if (!heroPreview) return;
  heroPreview.innerHTML = `
    <div class="hero-slide">
      <img src="${photo.image}" alt="${photo.title}">
      <div class="hero-slide-copy">
        <span class="eyebrow">${photo.category}</span>
        <h3>${photo.title}</h3>
        <p>${photo.description}</p>
        <a href="photo.html?id=${photo.id}" class="btn btn-secondary">Explore story</a>
      </div>
    </div>
  `;
};

const startHeroRotation = (photos) => {
  if (!photos.length || !heroPreview) return;
  heroPhotos = photos;
  renderHeroSlide(heroPhotos[heroIndex]);
  setInterval(() => {
    heroIndex = (heroIndex + 1) % heroPhotos.length;
    renderHeroSlide(heroPhotos[heroIndex]);
  }, 7000);
};

fetch('data/photos.json')
  .then((response) => response.json())
  .then((photos) => {
    const sorted = photos.slice().sort((a, b) => (a.date < b.date ? 1 : -1));
    sorted.slice(0, 6).forEach((photo) => galleryGrid.appendChild(createCard(photo)));
    if (sorted.length) {
      startHeroRotation(sorted.slice(0, 4));
    }
  })
  .catch(() => {
    if (galleryGrid) {
      galleryGrid.innerHTML = '<p class="error-text">Unable to load gallery data. Open this page through a local server or use Live Server in VS Code.</p>';
    }
  });
'''

gallery_js = r'''
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
'''

(Path(base, 'assets/css/style.css')).write_text(style, encoding='utf-8')
(Path(base, 'assets/js/main.js')).write_text(main_js, encoding='utf-8')
(Path(base, 'assets/js/gallery.js')).write_text(gallery_js, encoding='utf-8')
print('done')
