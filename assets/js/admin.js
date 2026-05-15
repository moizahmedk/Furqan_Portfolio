const photoForm = document.getElementById('photo-form');
const previewImage = document.getElementById('preview-image');
const previewTitle = document.getElementById('preview-title');
const previewCategory = document.getElementById('preview-category');
const previewDescription = document.getElementById('preview-description');
const downloadJson = document.getElementById('download-json');

const updatePreview = (metadata) => {
  previewImage.innerHTML = metadata.image ? `<img src="${metadata.image}" alt="${metadata.title}">` : 'Preview image will appear here';
  previewTitle.textContent = metadata.title || 'Title';
  previewCategory.textContent = metadata.category || 'Category';
  previewDescription.textContent = metadata.description || 'Description';
};

const buildMetadata = () => {
  const title = document.getElementById('title').value.trim();
  const category = document.getElementById('category').value.trim();
  const description = document.getElementById('description').value.trim();
  const image = document.getElementById('image').value.trim();
  const date = document.getElementById('date').value || new Date().toISOString().slice(0, 10);
  const slug = document.getElementById('slug').value.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const id = slug || `photo-${Date.now()}`;

  return {
    id,
    title,
    category,
    description,
    image,
    date,
  };
};

photoForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const metadata = buildMetadata();
  updatePreview(metadata);
  const jsonText = JSON.stringify(metadata, null, 2);
  navigator.clipboard?.writeText(jsonText).catch(() => {});
  alert('Photo metadata generated. JSON has been copied to the clipboard. Paste it into data/photos.json and save the file.');
});

downloadJson?.addEventListener('click', () => {
  const metadata = buildMetadata();
  const blob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${metadata.id}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
});

photoForm?.addEventListener('input', () => {
  const metadata = buildMetadata();
  updatePreview(metadata);
});

updatePreview({
  title: 'Title',
  category: 'Category',
  description: 'Description',
  image: '',
});
