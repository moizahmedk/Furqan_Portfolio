
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
