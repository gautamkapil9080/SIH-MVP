# Simple HTTP Server for Nabha Telemedicine Demo
$port = 8080
$url = "http://localhost:$port/"

Write-Host "🚀 Starting Nabha Telemedicine Demo Server..." -ForegroundColor Green
Write-Host "📍 Local URL: $url" -ForegroundColor Cyan
Write-Host "🌐 Share this with judges: http://YOUR_IP_ADDRESS:$port/" -ForegroundColor Yellow
Write-Host "⚡ Press Ctrl+C to stop server" -ForegroundColor Red
Write-Host ""

# Get local IP address
$localIP = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Wi-Fi*", "Ethernet*" | Where-Object {$_.IPAddress -notlike "169.254*" -and $_.IPAddress -notlike "127.*"}).IPAddress | Select-Object -First 1

if ($localIP) {
    Write-Host "🔗 Shareable URL for judges: http://$localIP`:$port/" -ForegroundColor Green
} else {
    Write-Host "🔗 Get your IP with: ipconfig" -ForegroundColor Yellow
}
Write-Host ""

# Start simple HTTP server
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($url)
$listener.Start()

Write-Host "✅ Server is running! Opening in browser..." -ForegroundColor Green
Start-Process $url

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $localPath = $request.Url.LocalPath
        if ($localPath -eq "/") { $localPath = "/index.html" }
        
        $filePath = Join-Path $PWD ($localPath.TrimStart('/'))
        
        if (Test-Path $filePath) {
            $content = [System.IO.File]::ReadAllBytes($filePath)
            
            # Set content type based on file extension
            $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
            switch ($extension) {
                '.html' { $response.ContentType = 'text/html' }
                '.css'  { $response.ContentType = 'text/css' }
                '.js'   { $response.ContentType = 'application/javascript' }
                '.json' { $response.ContentType = 'application/json' }
                default { $response.ContentType = 'application/octet-stream' }
            }
            
            $response.ContentLength64 = $content.Length
            $response.OutputStream.Write($content, 0, $content.Length)
            $response.StatusCode = 200
        } else {
            $response.StatusCode = 404
            $errorContent = [System.Text.Encoding]::UTF8.GetBytes("404 - File Not Found")
            $response.OutputStream.Write($errorContent, 0, $errorContent.Length)
        }
        
        $response.Close()
    }
} catch {
    Write-Host "Server stopped" -ForegroundColor Red
} finally {
    $listener.Stop()
}