# Copies SmartTech/web into Archive safely and fixes relative paths for static hosting
# Usage: Run from PowerShell as Administrator or user with file access
#   cd "C:\Users\royal\OneDrive\Рабочий стол\SmartTech\scripts"
#   .\deploy_to_archive.ps1

$source = "C:\Users\royal\OneDrive\Рабочий стол\SmartTech\web"
$dest = "C:\Users\royal\OneDrive\Рабочий стол\Archive"

if (-not (Test-Path $source)) {
    Write-Error "Source not found: $source"
    exit 1
}
if (-not (Test-Path $dest)) {
    Write-Host "Destination not found, creating: $dest"
    New-Item -ItemType Directory -Path $dest | Out-Null
}

$timestamp = Get-Date -Format yyyyMMddHHmmss
$backup = "$dest-backup-$timestamp"
Write-Host "Creating backup of current Archive at: $backup"
Copy-Item -Path $dest -Destination $backup -Recurse -Force

# Copy HTML pages (preserve structure) - copy top-level pages
Write-Host "Copying HTML pages from $source/pages -> $dest"
$pagesSrc = Join-Path $source "pages"
if (Test-Path $pagesSrc) {
    Get-ChildItem -Path $pagesSrc -Filter *.html -Recurse | ForEach-Object {
        $relative = $_.FullName.Substring($pagesSrc.Length).TrimStart('\')
        $target = Join-Path $dest $relative
        $targetDir = Split-Path $target -Parent
        if (-not (Test-Path $targetDir)) { New-Item -ItemType Directory -Path $targetDir | Out-Null }
        Copy-Item -Path $_.FullName -Destination $target -Force
    }
} else {
    Write-Warning "Pages folder not found: $pagesSrc"
}

# Copy src, images, styles and other assets
$toCopy = @("src","images","styles","static","web/images")
foreach ($name in $toCopy) {
    $s = Join-Path $source $name
    if (Test-Path $s) {
        $d = Join-Path $dest $name
        Write-Host "Copying $s -> $d"
        robocopy $s $d /MIR /NFL /NDL /NJH /NJS | Out-Null
    }
}

# Fix HTML relative paths: replace ../src/ with src/ and ../images/ with images/
Write-Host "Fixing relative paths in HTML files under $dest"
Get-ChildItem -Path $dest -Filter *.html -Recurse | ForEach-Object {
    $file = $_.FullName
    (Get-Content $file -Raw) -replace '\.\./src/','src/' -replace '\.\./images/','images/' -replace '\.\./styles/','styles/' | Set-Content $file -Force
    Write-Host "Patched: $file"
}

Write-Host "Deploy complete. Backup at: $backup"
Write-Host "To test locally:"
Write-Host "  cd \"$dest\""
Write-Host "  python -m http.server 8000"
Write-Host "Then open http://localhost:8000 in your browser"
