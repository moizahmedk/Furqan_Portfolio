param(
  [string]$Title,
  [string]$Category,
  [string]$Description,
  [string]$ImagePath,
  [string]$ImageFileName,
  [string]$Branch = 'main',
  [switch]$Push
)

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptRoot
$repoRoot = Resolve-Path ..\
$repoRoot = $repoRoot.Path
$dataFile = Join-Path $repoRoot 'data\photos.json'
$imgDir = Join-Path $repoRoot 'img'

if (-not $Title -or -not $Category -or -not $Description -or -not $ImagePath) {
  Write-Host 'Usage: .\scripts\add-photo.ps1 -Title "Title" -Category "Category" -Description "Description" -ImagePath "C:\path\to\photo.jpg" [-ImageFileName "photo.jpg"] [-Push]'
  return
}

if (-not (Test-Path $ImagePath)) {
  Write-Error "Image path not found: $ImagePath"
  return
}

if (-not (Test-Path $imgDir)) {
  New-Item -Path $imgDir -ItemType Directory | Out-Null
}

$filename = if ($ImageFileName) { $ImageFileName } else { [System.IO.Path]::GetFileName($ImagePath) }
$targetPath = Join-Path $imgDir $filename
Copy-Item -Path $ImagePath -Destination $targetPath -Force

$existing = Get-Content $dataFile -Raw | ConvertFrom-Json
$newId = ($Title.ToLower() -replace '[^a-z0-9]+', '-') -replace '(^-|-$)', ''
if (-not $newId) { $newId = "photo-$(Get-Date -Format yyyyMMddHHmmss)" }

$entry = [PSCustomObject]@{
  id = $newId
  title = $Title
  category = $Category
  description = $Description
  image = "img/$filename"
  date = (Get-Date).ToString('yyyy-MM-dd')
}

$existing += $entry
$existing | ConvertTo-Json -Depth 5 | Set-Content -Path $dataFile -Encoding utf8

git add $dataFile $targetPath
git commit -m "Add photo: $Title"

if ($Push) {
  git push origin $Branch
}

Write-Host "Photo entry added: $Title"
Write-Host "Image copied to: $targetPath"
Write-Host "Data file updated at: $dataFile"
if ($Push) { Write-Host 'Pushed to GitHub.' }
