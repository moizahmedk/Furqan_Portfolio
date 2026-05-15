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
const githubSettingsKey = 'furqan-admin-github-settings';
let activePreviewUrl = null;

const slugify = (text) => {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

const setStatus = (message, type = 'info') => {
  if (!saveStatus) return;
  saveStatus.textContent = message;
  saveStatus.className = 'save-status';
  saveStatus.classList.toggle('error', type === 'error');
  saveStatus.classList.toggle('success', type === 'success');
};

const clearStatus = () => {
  if (!saveStatus) return;
  setTimeout(() => {
    saveStatus.textContent = '';
    saveStatus.className = 'save-status';
  }, 5000);
};

const loadGitHubSettings = () => {
  if (!window.localStorage) return;
  try {
    const saved = localStorage.getItem(githubSettingsKey);
    if (!saved) return;
    const settings = JSON.parse(saved);
    githubOwnerInput.value = settings.owner || '';
    githubRepoInput.value = settings.repo || '';
    githubBranchInput.value = settings.branch || 'main';
  } catch (error) {
    console.warn('Unable to load GitHub settings', error);
  }
};

const saveGitHubSettings = (owner, repo, branch) => {
  if (!window.localStorage) return;
  localStorage.setItem(githubSettingsKey, JSON.stringify({ owner, repo, branch }));
};

const revokePreviewUrl = () => {
  if (activePreviewUrl) {
    URL.revokeObjectURL(activePreviewUrl);
    activePreviewUrl = null;
  }
};

const updatePreview = (metadata, previewSrc = '') => {
  revokePreviewUrl();
  if (previewSrc) {
    previewImage.innerHTML = `<img src="${previewSrc}" alt="${metadata.title || 'Preview image'}">`;
  } else if (metadata.image) {
    previewImage.innerHTML = `<img src="${metadata.image}" alt="${metadata.title || 'Preview image'}">`;
  } else {
    previewImage.textContent = 'Preview image will appear here';
  }

  previewTitle.textContent = metadata.title || 'Title';
  previewCategory.textContent = metadata.category || 'Category';
  previewDescription.textContent = metadata.description || 'Description';
};

const getImageFile = () => {
  return imageFileInput?.files?.[0] ?? null;
};

const getImagePath = (metadata, imageFile) => {
  if (imageFile) {
    const extension = imageFile.name.split('.').pop().toLowerCase();
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

  return { id, title, category, description, image, date };
};

const toBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const encodeUtf8ToBase64 = (str) => btoa(unescape(encodeURIComponent(str)));

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
  const body = { message, content: contentBase64, branch };
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

const getPreviewSource = (metadata, imageFile) => {
  if (imageFile) {
    const previewUrl = URL.createObjectURL(imageFile);
    activePreviewUrl = previewUrl;
    return previewUrl;
  }

  return metadata.image || '';
};

const buildAndPreview = () => {
  const metadata = buildMetadata();
  const file = getImageFile();
  metadata.image = getImagePath(metadata, file) || metadata.image;
  const previewSrc = getPreviewSource(metadata, file);
  updatePreview(metadata, previewSrc);
  return metadata;
};

const setFormDisabled = (disabled) => {
  Array.from(photoForm.elements).forEach((element) => {
    element.disabled = disabled;
  });
};

const validateMetadata = (metadata, file) => {
  if (!metadata.title || !metadata.category) {
    throw new Error('Title and category are required.');
  }

  if (!metadata.image && !file) {
    throw new Error('Provide an image URL or upload a JPG/PNG file.');
  }
};

photoForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  try {
    const metadata = buildAndPreview();
    validateMetadata(metadata, getImageFile());
    navigator.clipboard?.writeText(JSON.stringify(metadata, null, 2)).catch(() => {});
    setStatus('Photo metadata previewed. JSON copied to clipboard.', 'success');
  } catch (error) {
    setStatus(error.message, 'error');
  } finally {
    clearStatus();
  }
});

downloadJson?.addEventListener('click', () => {
  try {
    const metadata = buildAndPreview();
    validateMetadata(metadata, getImageFile());
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
  } catch (error) {
    setStatus(error.message, 'error');
  } finally {
    clearStatus();
  }
});

saveGithub?.addEventListener('click', async () => {
  const metadata = buildAndPreview();
  const file = getImageFile();
  const owner = githubOwnerInput?.value.trim();
  const repo = githubRepoInput?.value.trim();
  const branch = githubBranchInput?.value.trim() || 'main';
  const token = githubTokenInput?.value.trim();

  try {
    if (!owner || !repo || !token) {
      throw new Error('GitHub owner, repo, and token are required to save.');
    }

    validateMetadata(metadata, file);
    saveGitHubSettings(owner, repo, branch);

    setStatus('Saving to GitHub...');
    setFormDisabled(true);

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
    const savedOwner = owner;
    const savedRepo = repo;
    const savedBranch = branch;
    photoForm.reset();
    githubOwnerInput.value = savedOwner;
    githubRepoInput.value = savedRepo;
    githubBranchInput.value = savedBranch;
    githubTokenInput.value = '';
    updatePreview({ title: 'Title', category: 'Category', description: 'Description', image: '' });
  } catch (error) {
    setStatus(error.message || 'GitHub save failed.', 'error');
  } finally {
    setFormDisabled(false);
    clearStatus();
  }
});

photoForm?.addEventListener('input', buildAndPreview);
imageFileInput?.addEventListener('change', buildAndPreview);

loadGitHubSettings();
updatePreview({ title: 'Title', category: 'Category', description: 'Description', image: '' });
