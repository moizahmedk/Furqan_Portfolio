const detailContainer = document.getElementById('photo-detail');

const getQueryParam = (name) => {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
};

const renderDetail = (photo) => {
  detailContainer.innerHTML = `
    <article class="detail-card">
      <img src="${photo.image}" alt="${photo.title}">
      <div class="card-body">
        <span class="eyebrow">${photo.category}</span>
        <h2>${photo.title}</h2>
        <p>${photo.description}</p>
        <div class="card-footer">
          <span>${photo.date}</span>
          <a href="gallery.html">Back to gallery</a>
        </div>
      </div>
    </article>
  `;
};

fetch('data/photos.json')
  .then((response) => response.json())
  .then((photos) => {
    const id = getQueryParam('id');
    const photo = photos.find((item) => item.id === id);
    if (photo) {
      renderDetail(photo);
    } else {
      detailContainer.innerHTML = '<p class="error-text">Photo not found. Return to the gallery and select a valid item.</p>';
    }
  })
  .catch(() => {
    detailContainer.innerHTML = '<p class="error-text">Unable to load photo data. Open this page through a local server or use Live Server in VS Code.</p>';
  });
