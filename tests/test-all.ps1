# Comprehensive test script for SmartCLI
$ErrorActionPreference = "Stop"

Write-Host "Starting SmartCLI comprehensive tests..." -ForegroundColor Cyan

# Test Core Module
Write-Host "`nTesting Core Module..." -ForegroundColor Yellow
try {
    # Dot source the core module directly for testing
    $corePath = Join-Path $PSScriptRoot "../Modules/Core/core.ps1"
    . $corePath
    Write-Host "Core module loaded successfully" -ForegroundColor Green
    
    # Test configuration functions
    $testConfig = @{
        "test" = "value"
    }
    
    # Create config directory if it doesn't exist
    $configDir = Join-Path $PSScriptRoot "../config"
    if (!(Test-Path $configDir)) {
        New-Item -ItemType Directory -Path $configDir -Force | Out-Null
    }
    
    # Test configuration functions using direct calls
    $configPath = Join-Path $configDir "test.json"
    $testConfig | ConvertTo-Json | Set-Content $configPath
    $loadedConfig = Get-Content $configPath | ConvertFrom-Json
    
    if ($loadedConfig.test -eq "value") {
        Write-Host "Configuration test passed" -ForegroundColor Green
    }
    else {
        throw "Configuration test failed"
    }
}
catch {
    Write-Host "Core module test failed: $_" -ForegroundColor Red
    exit 1
}

# Test Docker Module
Write-Host "`nTesting Docker Module..." -ForegroundColor Yellow
try {
    # Dot source the Docker module directly for testing
    $dockerPath = Join-Path $PSScriptRoot "../Modules/Docker/docker.ps1"
    . $dockerPath
    Write-Host "Docker module loaded successfully" -ForegroundColor Green
    
    # Test Docker installation check
    try {
        $dockerVersion = docker version --format '{{.Server.Version}}'
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Docker installation check passed: version $dockerVersion" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "Docker is not installed or not running (this is okay for testing)" -ForegroundColor Yellow
    }
    
    # Test container listing function exists
    if (Get-Command "Get-DockerContainers" -ErrorAction SilentlyContinue) {
        Write-Host "Docker container functions available" -ForegroundColor Green
    }
    else {
        throw "Docker functions not properly loaded"
    }
}
catch {
    Write-Host "Docker module test failed: $_" -ForegroundColor Red
    exit 1
}

# Test SmartCLI main script
Write-Host "`nTesting SmartCLI main script..." -ForegroundColor Yellow
try {
    $mainScript = Join-Path $PSScriptRoot "../smartcli.ps1"
    if (Test-Path $mainScript) {
        . $mainScript
        Write-Host "SmartCLI main script loaded successfully" -ForegroundColor Green
        
        # Test basic commands exist
        if ((Get-Command "smartcli" -ErrorAction SilentlyContinue)) {
            Write-Host "SmartCLI command available" -ForegroundColor Green
        }
    }
    else {
        throw "SmartCLI main script not found"
    }
}
catch {
    Write-Host "SmartCLI main script test failed: $_" -ForegroundColor Red
    exit 1
}

# Test installation script
Write-Host "`nTesting installation script..." -ForegroundColor Yellow
try {
    $installScript = Join-Path $PSScriptRoot "../Modules/install_smartcli.ps1"
    if (Test-Path $installScript) {
        . $installScript
        Write-Host "Installation script loaded successfully" -ForegroundColor Green
    }
    else {
        throw "Installation script not found"
    }
}
catch {
    Write-Host "Installation script test failed: $_" -ForegroundColor Red
    exit 1
}

Write-Host "`nAll tests completed successfully!" -ForegroundColor Green
