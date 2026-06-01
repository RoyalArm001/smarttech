# ================================================
# Smart Tech - Partner Logos Downloader (deprecated for now)
# We are using www.smarttechllc.am hosted images instead.
# This script is kept for future local migration if needed.
# ================================================

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$partnersDir = Join-Path $root "web\img\partners"
$techDir     = Join-Path $partnersDir "technology"

# Create folders
New-Item -ItemType Directory -Path $partnersDir -Force | Out-Null
New-Item -ItemType Directory -Path $techDir -Force | Out-Null

Write-Host "Downloading partner logos..." -ForegroundColor Cyan

$partners = @(
    "acba.png",
    "evoca.png",
    "flyArna.png",
    "uls.png",
    "fit24.png",
    "pesto.png",
    "viena.png",
    "vda.png",
    "dors.png",
    "grand.png",
    "ax.png",
    "saber.png"
)

$techPartners = @(
    "abb.png",
    "jung.png",
    "huawei.png",
    "eaton.png",
    "schneider-electric.png",
    "hdl.png",
    "zennio.png",
    "extron.png",
    "yealink.png",
    "beg.png",
    "yamaha.png",
    "hikvision.png",
    "zyxel.png",
    "gira.png",
    "beckhoff.png",
    "carrier.png",
    "siemens.png",
    "legrand.png",
    "honeywell.png",
    "helvar.png",
    "interra.png",
    "sharp.png",
    "wago.png",
    "obo-bettermann.png",
    "polycom.png",
    "phoenix-contact.png",
    "iridium-mobile.png",
    "vola.png",
    "ekinex.png",
    "schrack-seconet.png"
)

$baseUrl = "https://www.smarttechllc.am/images/partners"

function Download-Logo($name, $destFolder) {
    $url = "$baseUrl/$name"
    $dest = Join-Path $destFolder $name

    try {
        Invoke-WebRequest -Uri $url -OutFile $dest -UseBasicParsing -TimeoutSec 30
        Write-Host "  ✓ $name" -ForegroundColor Green
    } catch {
        Write-Host "  ✗ Failed: $name" -ForegroundColor Red
    }
}

Write-Host "`nRegular Partners:" -ForegroundColor Yellow
foreach ($logo in $partners) {
    Download-Logo $logo $partnersDir
}

Write-Host "`nTechnology Partners:" -ForegroundColor Yellow
foreach ($logo in $techPartners) {
    Download-Logo $logo $techDir
}

Write-Host "`nDone!" -ForegroundColor Cyan
Write-Host "Logos saved to: web\img\partners\" -ForegroundColor Green
Write-Host "You can now edit the PNGs locally to remove black backgrounds if needed." -ForegroundColor Gray
Write-Host "After editing, run the site normally." -ForegroundColor Gray
