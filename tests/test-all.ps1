# Comprehensive test script for SmartCLI
$ErrorActionPreference = "Stop"

Write-Host "Starting SmartCLI comprehensive tests..." -ForegroundColor Cyan

# Test Core Module
Write-Host "`nTesting Core Module..." -ForegroundColor Yellow
try {
    . (Join-Path $PSScriptRoot "../Modules/Core/core.ps1")
    Write-SmartOutput "Core module loaded successfully" -ForegroundColor Green
    
    # Test configuration functions
    $testConfig = @{
        "test" = "value"
    }
    Set-SmartConfig -ConfigName "test" -ConfigData $testConfig
    $loadedConfig = Get-SmartConfig -ConfigName "test"
    
    if ($loadedConfig.test -eq "value") {
        Write-SmartOutput "Configuration test passed" -ForegroundColor Green
    }
    else {
        throw "Configuration test failed"
    }
}
catch {
    Write-SmartError "Core module test failed: $_"
    exit 1
}

# Test Docker Module
Write-Host "`nTesting Docker Module..." -ForegroundColor Yellow
try {
    . (Join-Path $PSScriptRoot "../Modules/Docker/docker.ps1")
    Write-SmartOutput "Docker module loaded successfully" -ForegroundColor Green
    
    # Test Docker installation check
    $dockerInstalled = Test-DockerInstallation
    Write-SmartOutput "Docker installation check: $dockerInstalled" -ForegroundColor Green
    
    # Test container listing
    Write-SmartOutput "Testing container listing..." -ForegroundColor Yellow
    Get-DockerContainers -All
    
    # Test image listing
    Write-SmartOutput "Testing image listing..." -ForegroundColor Yellow
    Get-DockerImages -All
}
catch {
    Write-SmartError "Docker module test failed: $_"
    exit 1
}

# Test SmartCLI main script
Write-Host "`nTesting SmartCLI main script..." -ForegroundColor Yellow
try {
    . (Join-Path $PSScriptRoot "../smartcli.ps1")
    Write-SmartOutput "SmartCLI main script loaded successfully" -ForegroundColor Green
    
    # Test version command
    Write-SmartOutput "Testing version command..." -ForegroundColor Yellow
    smartcli --version
    
    # Test help command
    Write-SmartOutput "Testing help command..." -ForegroundColor Yellow
    smartcli --help
}
catch {
    Write-SmartError "SmartCLI main script test failed: $_"
    exit 1
}

# Test installation script
Write-Host "`nTesting installation script..." -ForegroundColor Yellow
try {
    . (Join-Path $PSScriptRoot "../Modules/install_smartcli.ps1")
    Write-SmartOutput "Installation script loaded successfully" -ForegroundColor Green
}
catch {
    Write-SmartError "Installation script test failed: $_"
    exit 1
}

Write-Host "`nAll tests completed successfully!" -ForegroundColor Green
