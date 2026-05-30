param(
    [int]$Port = 8000,
    [string]$Root = "C:\Users\royal\OneDrive\Рабочий стол\Archive"
)

Add-Type -AssemblyName System.Net.HttpListener
$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "Serving $Root at $prefix"

while ($listener.IsListening) {
    $context = $listener.GetContext()
    Start-Job -ScriptBlock {
        param($ctx,$root)
        try {
            $req = $ctx.Request
            $resp = $ctx.Response
            $urlPath = [System.Uri]::UnescapeDataString($req.Url.AbsolutePath.TrimStart('/'))
            if ([string]::IsNullOrEmpty($urlPath)) { $urlPath = 'index.html' }
            $filePath = Join-Path $root $urlPath
            if (-not (Test-Path $filePath -PathType Leaf)) {
                $resp.StatusCode = 404
                $buffer = [System.Text.Encoding]::UTF8.GetBytes('404 Not Found')
                $resp.ContentLength64 = $buffer.Length
                $resp.OutputStream.Write($buffer,0,$buffer.Length)
                $resp.OutputStream.Close()
                return
            }
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $mime = 'application/octet-stream'
            switch ([System.IO.Path]::GetExtension($filePath).ToLower()) {
                '.html' { $mime = 'text/html; charset=utf-8' }
                '.css'  { $mime = 'text/css' }
                '.js'   { $mime = 'application/javascript' }
                '.json' { $mime = 'application/json' }
                '.png'  { $mime = 'image/png' }
                '.jpg'  { $mime = 'image/jpeg' }
                '.jpeg' { $mime = 'image/jpeg' }
                '.gif'  { $mime = 'image/gif' }
                '.svg'  { $mime = 'image/svg+xml' }
                '.webp' { $mime = 'image/webp' }
            }
            $resp.ContentType = $mime
            $resp.ContentLength64 = $bytes.Length
            $resp.OutputStream.Write($bytes,0,$bytes.Length)
            $resp.OutputStream.Close()
        } catch {
            Write-Host "Error serving request: $_"
        }
    } -ArgumentList $context,$Root | Out-Null
}

$listener.Stop()
$listener.Close()
