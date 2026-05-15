# Furqan Photography Portfolio

This repository contains a static photography portfolio built for GitHub with:

- `index.html` — portfolio landing page with featured work
- `gallery.html` — gallery listing and story pages
- `admin.html` — admin interface to prepare new photo metadata
- `data/photos.json` — gallery photo data source
- `scripts/add-photo.ps1` — add images and metadata, commit changes, and optionally push to GitHub
- `scripts/push-changes.ps1` — commit and push any repository updates

## Usage

1. Open `index.html` or `gallery.html` using a local web server or Live Server in VS Code.
2. Use `admin.html` to generate new photo metadata and preview entries.
3. Add photos locally by running the PowerShell helper:

```powershell
Set-Location d:\furqan
./scripts/add-photo.ps1 -Title "My New Photo" -Category "Portrait" -Description "A new portrait shoot." -ImagePath "C:\path\to\photo.jpg" -Push
```

4. Commit and push any other changes with:

```powershell
Set-Location d:\furqan
./scripts/push-changes.ps1 -Message "Update portfolio content"
```

## Notes

- `data/photos.json` is the main content source for the gallery.
- Use GitHub as the content platform by pushing images and data updates to the repo.
- The `admin.html` page helps generate the JSON metadata to add into `data/photos.json`.

