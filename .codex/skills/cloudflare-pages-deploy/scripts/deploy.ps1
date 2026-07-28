[CmdletBinding()]
param(
  [string]$ProjectRoot = "",
  [string]$Repository = "https://github.com/GCSimba/personal-website.git",
  [string]$Branch = "main",
  [string]$Message = "Deploy website updates",
  [string]$AuthorName = "",
  [string]$AuthorEmail = "",
  [string]$GitPath = "",
  [switch]$NoPush
)

$ErrorActionPreference = "Stop"

function Resolve-GitExecutable {
  param([string]$RequestedPath)

  $candidates = @()
  if ($RequestedPath) { $candidates += $RequestedPath }
  $command = Get-Command git -ErrorAction SilentlyContinue
  if ($command) { $candidates += $command.Source }
  $candidates += (Join-Path $HOME ".cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe")

  foreach ($candidate in $candidates | Select-Object -Unique) {
    if ($candidate -and (Test-Path -LiteralPath $candidate)) {
      return (Resolve-Path -LiteralPath $candidate).Path
    }
  }
  throw "Git is required. Install Git or pass -GitPath with the full path to git.exe."
}

function Get-FileMap {
  param([string]$Root, [string[]]$IgnoredTopLevelDirectories)

  $map = @{}
  Get-ChildItem -LiteralPath $Root -Recurse -File | ForEach-Object {
    $relative = $_.FullName.Substring($Root.Length).TrimStart("\", "/")
    $topLevel = ($relative -split "[\\/]")[0]
    if ($IgnoredTopLevelDirectories -notcontains $topLevel) {
      $map[$relative.Replace("\", "/")] = $_.FullName
    }
  }
  return $map
}

if (-not $ProjectRoot) {
  $ProjectRoot = Join-Path $PSScriptRoot "..\..\..\.."
}
$ProjectRoot = (Resolve-Path -LiteralPath $ProjectRoot).Path
$Git = Resolve-GitExecutable $GitPath
$tempBase = [System.IO.Path]::GetTempPath().TrimEnd("\")
$stage = Join-Path $tempBase ("codex-pages-deploy-" + [guid]::NewGuid().ToString("N"))

& $Git clone --branch $Branch --single-branch $Repository $stage
if ($LASTEXITCODE -ne 0) { throw "Unable to clone $Repository. Check GitHub access and the branch name." }

$ignored = @(".git", "node_modules", "__pycache__")
$localFiles = Get-FileMap $ProjectRoot $ignored
$stageFiles = Get-FileMap $stage $ignored

foreach ($relativePath in $stageFiles.Keys) {
  if (-not $localFiles.ContainsKey($relativePath)) {
    Remove-Item -LiteralPath $stageFiles[$relativePath] -Force
  }
}

foreach ($relativePath in $localFiles.Keys) {
  $destination = Join-Path $stage ($relativePath.Replace("/", "\"))
  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $destination) | Out-Null
  Copy-Item -LiteralPath $localFiles[$relativePath] -Destination $destination -Force
}

& $Git -C $stage add --all
if ($LASTEXITCODE -ne 0) { throw "Unable to stage the deployment files." }
& $Git -C $stage diff --cached --check
if ($LASTEXITCODE -ne 0) { throw "The staged deployment diff has whitespace errors." }

$status = & $Git -C $stage status --short
if (-not $status) {
  Write-Output "No deployment changes detected."
  exit 0
}

Write-Output "Staged deployment changes:"
$status | Write-Output
& $Git -C $stage diff --cached --stat

if ($NoPush) {
  Write-Output "NoPush selected; no commit or push was made."
  exit 0
}

if (-not $AuthorName) { $AuthorName = (& $Git -C $stage log -1 --format=%an).Trim() }
if (-not $AuthorEmail) { $AuthorEmail = (& $Git -C $stage log -1 --format=%ae).Trim() }
if (-not $AuthorName -or -not $AuthorEmail) {
  throw "Set -AuthorName and -AuthorEmail, or configure a Git identity before publishing."
}

& $Git -C $stage config user.name $AuthorName
& $Git -C $stage config user.email $AuthorEmail
& $Git -C $stage commit -m $Message
if ($LASTEXITCODE -ne 0) { throw "Unable to create the deployment commit." }

$commit = (& $Git -C $stage rev-parse HEAD).Trim()
& $Git -C $stage push origin $Branch
if ($LASTEXITCODE -ne 0) { throw "Push failed. The remote branch may have advanced or GitHub authentication may be unavailable." }

Write-Output "Pushed $commit to $Repository ($Branch). Cloudflare Pages should now deploy it automatically."
