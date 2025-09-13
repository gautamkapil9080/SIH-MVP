# Nabha Telemedicine - Create Deployment Package
# This script creates a clean deployment package ready for upload

Write-Host "🚀 Creating Nabha Telemedicine Deployment Package..." -ForegroundColor Green

# Create deployment directory
$deployDir = "nabha-telemedicine-deploy"
if (Test-Path $deployDir) {
    Remove-Item $deployDir -Recurse -Force
}
New-Item -ItemType Directory -Path $deployDir | Out-Null

Write-Host "📁 Copying essential files..." -ForegroundColor Yellow

# Copy essential files for deployment
$essentialFiles = @(
    "index.html",
    "app.js", 
    "translations.js",
    "styles.css",
    "manifest.json",
    "README.md",
    "DEPLOYMENT-GUIDE.md",
    "test-functionality.html"
)

foreach ($file in $essentialFiles) {
    if (Test-Path $file) {
        Copy-Item $file -Destination $deployDir
        Write-Host "  ✅ Copied: $file" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  Missing: $file" -ForegroundColor Red
    }
}

# Create deployment info file
$deployInfo = @"
# Nabha Telemedicine MVP - Deployment Package
Generated: $(Get-Date)
Version: 1.0.0
Status: Production Ready

## Quick Start:
1. Upload all files to web server
2. Access index.html in browser
3. Test functionality with test-functionality.html

## Deployment Options:
- Netlify: Drag & drop this folder to netlify.com
- GitHub Pages: Upload to repository and enable Pages
- Web Server: Upload to any web hosting service

## Files Included:
"@

foreach ($file in $essentialFiles) {
    if (Test-Path $file) {
        $deployInfo += "`n- $file"
    }
}

$deployInfo | Out-File -FilePath "$deployDir\DEPLOY-INFO.txt" -Encoding UTF8

# Create zip file for easy deployment
Write-Host "📦 Creating ZIP package..." -ForegroundColor Yellow
$zipPath = "nabha-telemedicine-deploy.zip"
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

# Create zip file
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($deployDir, $zipPath)

# Display results
Write-Host ""
Write-Host "✅ DEPLOYMENT PACKAGE CREATED!" -ForegroundColor Green
Write-Host "📁 Folder: $deployDir" -ForegroundColor Cyan
Write-Host "📦 ZIP File: $zipPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 READY TO DEPLOY!" -ForegroundColor Green
Write-Host ""
Write-Host "Quick Deploy Options:" -ForegroundColor Yellow
Write-Host "1. 🌐 Netlify: Go to netlify.com, drag & drop the ZIP file" -ForegroundColor White
Write-Host "2. 📊 GitHub: Create repo, upload files, enable GitHub Pages" -ForegroundColor White
Write-Host "3. 🏥 Local Network: Copy files to web server directory" -ForegroundColor White
Write-Host ""
Write-Host "Test URL structure after deployment:" -ForegroundColor Yellow
Write-Host "- Main App: https://your-domain.com/" -ForegroundColor White
Write-Host "- Function Test: https://your-domain.com/test-functionality.html" -ForegroundColor White
Write-Host ""

# Check file sizes
Write-Host "Package Contents:" -ForegroundColor Yellow
Get-ChildItem $deployDir | ForEach-Object {
    $size = [math]::Round($_.Length / 1KB, 2)
    Write-Host "  $($_.Name): $size KB" -ForegroundColor White
}

$totalSize = [math]::Round((Get-ChildItem $deployDir | Measure-Object -Property Length -Sum).Sum / 1KB, 2)
Write-Host "  Total: $totalSize KB" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎉 The MVP is ready for immediate deployment!" -ForegroundColor Green