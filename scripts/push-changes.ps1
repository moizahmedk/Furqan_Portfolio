param(
  [string]$Message = 'Update photography portfolio',
  [string]$Branch = 'main'
)

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptRoot
$repoRoot = Resolve-Path ..\
$repoRoot = $repoRoot.Path
Set-Location $repoRoot

$changes = git status --short
if (-not $changes) {
  Write-Host 'No changes to commit.'
  return
}

git add -A
git commit -m "$Message"
git push origin $Branch
Write-Host 'Changes committed and pushed.'
