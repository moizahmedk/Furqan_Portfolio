const galleryGrid = document.getElementById('gallery-grid');
const heroPreview = document.getElementById('hero-preview');

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

fetch('data/photos.json')
  .then((response) => response.json())
  .then((photos) => {
    const sorted = photos.slice().sort((a, b) => a.date < b.date ? 1 : -1);
    sorted.slice(0, 6).forEach((photo) => galleryGrid.appendChild(createCard(photo)));
    const heroPhoto = sorted[0];
    if (heroPhoto && heroPreview) {
      heroPreview.innerHTML = `<img src="${heroPhoto.image}" alt="${heroPhoto.title}">`;
    }
  })
  .catch(() => {
    if (galleryGrid) {
      galleryGrid.innerHTML = '<p class="error-text">Unable to load gallery data. Open this page through a local server or use Live Server in VS Code.</p>';
    }
  });
