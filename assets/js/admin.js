const photoForm = document.getElementById('photo-form');
const previewImage = document.getElementById('preview-image');
const previewTitle = document.getElementById('preview-title');
const previewCategory = document.getElementById('preview-category');
const previewDescription = document.getElementById('preview-description');
const downloadJson = document.getElementById('download-json');
const saveGithub = document.getElementById('save-github');
const saveStatus = document.getElementById('save-status');
const imageFileInput = document.getElementById('image-file');
const githubOwnerInput = document.getElementById('github-owner');
const githubRepoInput = document.getElementById('github-repo');
const githubBranchInput = document.getElementById('github-branch');
const githubTokenInput = document.getElementById('github-token');

const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];

const slugify = (text) => {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

const setStatus = (message, type = 'info') => {
  if (!saveStatus) return;
  saveStatus.textContent = message;
  saveStatus.className = 'save-status';
  if (type === 'error') saveStatus.classList.add('error');
  if (type === 'success') saveStatus.classList.add('success');
};

const updatePreview = (metadata) => {
  previewImage.innerHTML = metadata.image ? `<img src="${metadata.image}" alt="${metadata.title}">` : 'Preview image will appear here';
  previewTitle.textContent = metadata.title || 'Title';
  previewCategory.textContent = metadata.category || 'Category';
  previewDescription.textContent = metadata.description || 'Description';
};

const getImageFile = () => {
  const file = imageFileInput?.files?.[0];
  return file ?? null;
};

const getImagePath = (metadata, imageFile) => {
  if (imageFile) {
    const extension = imageFile.name.split('.').pop();
    const fileName = `${metadata.id}.${extension}`;
    return `img/${fileName}`;
  }

  return metadata.image;
};

const buildMetadata = () => {
  const title = document.getElementById('title').value.trim();
  const category = document.getElementById('category').value.trim();
  const description = document.getElementById('description').value.trim();
  const image = document.getElementById('image').value.trim();
  const date = document.getElementById('date').value || new Date().toISOString().slice(0, 10);
  const slug = document.getElementById('slug').value.trim() || slugify(title);
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

const toBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const encodeUtf8ToBase64 = (str) => {
  return btoa(unescape(encodeURIComponent(str)));
};

const fetchGitHubFile = async (owner, repo, path, branch, token) => {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`, {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github+json',
    },
  });
  if (!response.ok) {
    throw new Error(`GitHub file fetch failed: ${response.status}`);
  }
  return response.json();
};

const putGitHubFile = async (owner, repo, path, contentBase64, message, branch, token, sha) => {
  const body = {
    message,
    content: contentBase64,
    branch,
  };
  if (sha) body.sha = sha;

  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GitHub file save failed: ${response.status} ${errorText}`);
  }
  return response.json();
};

const uploadImageToGitHub = async (owner, repo, branch, token, imageFile, metadata) => {
  if (!imageFile) return null;

  if (!validImageTypes.includes(imageFile.type)) {
    throw new Error('Only JPG, JPEG, and PNG files are accepted.');
  }

  const extension = imageFile.name.split('.').pop().toLowerCase();
  const filename = `${metadata.id}.${extension}`;
  const path = `img/${filename}`;
  const content = await toBase64(imageFile);
  await putGitHubFile(owner, repo, path, content, `Add photo asset ${filename}`, branch, token);
  return path;
};

const updatePhotosJsonOnGitHub = async (owner, repo, branch, token, entry) => {
  const fileInfo = await fetchGitHubFile(owner, repo, 'data/photos.json', branch, token);
  const raw = atob(fileInfo.content.replace(/\n/g, ''));
  const photos = JSON.parse(raw);
  photos.push(entry);
  const updatedJson = encodeUtf8ToBase64(JSON.stringify(photos, null, 2));
  await putGitHubFile(owner, repo, 'data/photos.json', updatedJson, `Update photos.json for ${entry.title}`, branch, token, fileInfo.sha);
};

const buildAndPreview = () => {
  const metadata = buildMetadata();
  const file = getImageFile();
  metadata.image = getImagePath(metadata, file) || metadata.image;
  updatePreview(metadata);
  return metadata;
};

photoForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const metadata = buildAndPreview();

  if (!metadata.title || !metadata.category) {
    setStatus('Title and category are required.', 'error');
    return;
  }

  if (!metadata.image) {
    setStatus('Provide an image URL or upload a JPG/PNG file.', 'error');
    return;
  }

  const jsonText = JSON.stringify(metadata, null, 2);
  navigator.clipboard?.writeText(jsonText).catch(() => {});
  setStatus('Photo metadata generated. JSON copied to clipboard.', 'success');
});

downloadJson?.addEventListener('click', () => {
  const metadata = buildAndPreview();
  const blob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${metadata.id}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  setStatus('JSON snippet downloaded.', 'success');
});

saveGithub?.addEventListener('click', async () => {
  const metadata = buildAndPreview();
  const file = getImageFile();
  const owner = githubOwnerInput?.value.trim();
  const repo = githubRepoInput?.value.trim();
  const branch = githubBranchInput?.value.trim() || 'main';
  const token = githubTokenInput?.value.trim();

  if (!owner || !repo || !token) {
    setStatus('GitHub owner, repo, and token are required to save.', 'error');
    return;
  }

  if (!metadata.title || !metadata.category) {
    setStatus('Title and category are required.', 'error');
    return;
  }

  if (!metadata.image && !file) {
    setStatus('Provide an image URL or upload a JPG/PNG file.', 'error');
    return;
  }

  try {
    setStatus('Saving to GitHub...');
    let imagePath = metadata.image;
    if (file) {
      imagePath = await uploadImageToGitHub(owner, repo, branch, token, file, metadata);
      metadata.image = imagePath;
    }

    if (!metadata.image) {
      throw new Error('Unable to determine image path for the new entry.');
    }

    await updatePhotosJsonOnGitHub(owner, repo, branch, token, metadata);
    setStatus('Photo and metadata saved to GitHub successfully.', 'success');
  } catch (error) {
    setStatus(error.message || 'GitHub save failed.', 'error');
  }
});

photoForm?.addEventListener('input', buildAndPreview);

updatePreview({
  title: 'Title',
  category: 'Category',
  description: 'Description',
  image: '',
});
