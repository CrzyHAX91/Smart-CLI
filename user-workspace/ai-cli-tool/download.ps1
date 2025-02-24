# PowerShell script for Windows installation

Write-Host "Downloading Smart AI CLI..." -ForegroundColor Blue

# Create temporary directory
$tmpDir = New-Item -ItemType Directory -Path "$env:TEMP\smart-ai-cli-install" -Force
Push-Location $tmpDir

# Clone repository
Write-Host "Cloning repository..." -ForegroundColor Blue
git clone https://github.com/yourusername/smart-ai-cli.git
Set-Location smart-ai-cli

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Blue
npm install

# Build the project
Write-Host "Building project..." -ForegroundColor Blue
npm run build

# Create installation directory
$installDir = "$env:USERPROFILE\.smart-ai-cli"
New-Item -ItemType Directory -Path $installDir -Force

# Copy files to installation directory
Write-Host "Installing Smart AI CLI..." -ForegroundColor Blue
Copy-Item -Path "dist\*" -Destination $installDir -Recurse -Force
Copy-Item -Path "package.json" -Destination $installDir

# Add to PATH
$userPath = [Environment]::GetEnvironmentVariable("PATH", "User")
if ($userPath -notlike "*$installDir\bin*") {
    [Environment]::SetEnvironmentVariable(
        "PATH",
        "$userPath;$installDir\bin",
        "User"
    )
}

# Create bin directory and copy executable
New-Item -ItemType Directory -Path "$installDir\bin" -Force
Copy-Item -Path "$installDir\smart-ai.js" -Destination "$installDir\bin\smart-ai.cmd" -Force

# Cleanup
Pop-Location
Remove-Item -Path $tmpDir -Recurse -Force

Write-Host "Installation complete!" -ForegroundColor Green
Write-Host "Please restart your terminal or PowerShell session" -ForegroundColor Blue
Write-Host
Write-Host "Try running: smart-ai --help" -ForegroundColor Green
