const galleryGrid = document.getElementById('gallery-grid');

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

fetch('data/photos.json')
  .then((response) => response.json())
  .then((photos) => {
    if (!galleryGrid) return;
    galleryGrid.innerHTML = '';
    photos.forEach((photo) => galleryGrid.appendChild(createCard(photo)));
  })
  .catch(() => {
    if (galleryGrid) {
      galleryGrid.innerHTML = '<p class="error-text">Unable to load gallery data. Open this page through a local server or use Live Server in VS Code.</p>';
    }
  });
