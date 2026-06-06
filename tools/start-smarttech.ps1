$ErrorActionPreference = "Continue"

$rootDir = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $rootDir

function Test-SmartTechServer {
  param([int] $Port)

  try {
    $response = Invoke-WebRequest -Uri ("http://127.0.0.1:{0}/" -f $Port) -UseBasicParsing -TimeoutSec 2
    return ($response.Content -match "Smart Tech|SmartTech|site-header")
  } catch {
    return $false
  }
}

Write-Host "Preparing SmartTech local server..."

$stoppedProcesses = @{}
foreach ($port in 3000..3010) {
  $listeners = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
  foreach ($listener in $listeners) {
    $owner = [int] $listener.OwningProcess
    if (-not $owner -or $owner -eq $PID -or $stoppedProcesses.ContainsKey($owner)) {
      continue
    }

    if (Test-SmartTechServer -Port $port) {
      try {
        Stop-Process -Id $owner -Force -ErrorAction Stop
        $stoppedProcesses[$owner] = $true
        Write-Host ("Stopped old SmartTech server on port {0}." -f $port)
      } catch {
        Write-Host ("Could not stop old SmartTech server on port {0}." -f $port)
      }
    } else {
      Write-Host ("Port {0} is used by another app; keeping it." -f $port)
    }
  }
}

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "Node.js was not found. Install Node.js 18 or newer, then run this file again."
  exit 1
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  Write-Host "npm was not found. Install Node.js 18 or newer, then run this file again."
  exit 1
}

$env:WEB_PORT = "3000"
$env:OPEN_BROWSER = "1"

Write-Host ""
Write-Host "Building SmartTech..."
npm run build
if ($LASTEXITCODE -ne 0) {
  Write-Host ""
  Write-Host "Build failed. Fix the error above, then run this file again."
  exit $LASTEXITCODE
}

Write-Host ""
Write-Host "Starting SmartTech..."
Write-Host "Close this window to stop the local web server."
Write-Host ""

node server.js
