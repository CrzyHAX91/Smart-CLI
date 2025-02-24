# Docker module for SmartCLI
# Provides Docker container and image management functionality

# Import core module
$CorePath = Join-Path $PSScriptRoot "../Core/core.ps1"
if (Test-Path $CorePath) {
    . $CorePath
}
else {
    throw "Core module not found. Please ensure SmartCLI is properly installed."
}

# Version information
$script:DOCKER_MODULE_VERSION = "1.0.0"

# Check if Docker is installed
function Test-DockerInstallation {
    [CmdletBinding()]
    param()
    
    try {
        $dockerVersion = docker version --format '{{.Server.Version}}'
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Docker version $dockerVersion detected" -ForegroundColor Green
            return $true
        }
    }
    catch {
        Write-Host "Docker is not installed or not running" -ForegroundColor Yellow
        return $false
    }
}

# List containers
function Get-DockerContainers {
    [CmdletBinding()]
    param(
        [switch]$All,
        [switch]$Quiet
    )
    
    if (!(Test-DockerInstallation)) {
        return
    }
    
    try {
        $args = @('ps')
        if ($All) { $args += '-a' }
        if ($Quiet) { $args += '-q' }
        
        $containers = docker $args
        if ($LASTEXITCODE -eq 0) {
            Write-Host $containers
            return $containers
        }
    }
    catch {
        $errorMessage = $_.Exception.Message
        Write-Host "Failed to list containers: $errorMessage" -ForegroundColor Red
    }
}

# List images
function Get-DockerImages {
    [CmdletBinding()]
    param(
        [switch]$All,
        [switch]$Quiet
    )
    
    if (!(Test-DockerInstallation)) {
        return
    }
    
    try {
        $args = @('images')
        if ($All) { $args += '-a' }
        if ($Quiet) { $args += '-q' }
        
        $images = docker $args
        if ($LASTEXITCODE -eq 0) {
            Write-Host $images
            return $images
        }
    }
    catch {
        $errorMessage = $_.Exception.Message
        Write-Host "Failed to list images: $errorMessage" -ForegroundColor Red
    }
}

# Start container
function Start-DockerContainer {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true)]
        [string]$ContainerName
    )
    
    if (!(Test-DockerInstallation)) {
        return
    }
    
    try {
        $result = docker start $ContainerName
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Container $ContainerName started successfully" -ForegroundColor Green
            return $true
        }
    }
    catch {
        $errorMessage = $_.Exception.Message
        Write-Host ("Failed to start container {0}: {1}" -f $ContainerName, $errorMessage) -ForegroundColor Red
        return $false
    }
}

# Stop container
function Stop-DockerContainer {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true)]
        [string]$ContainerName,
        
        [Parameter(Mandatory = $false)]
        [int]$Timeout = 10
    )
    
    if (!(Test-DockerInstallation)) {
        return
    }
    
    try {
        $result = docker stop --time $Timeout $ContainerName
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Container $ContainerName stopped successfully" -ForegroundColor Green
            return $true
        }
    }
    catch {
        $errorMessage = $_.Exception.Message
        Write-Host ("Failed to stop container {0}: {1}" -f $ContainerName, $errorMessage) -ForegroundColor Red
        return $false
    }
}

# Get container logs
function Get-DockerLogs {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true)]
        [string]$ContainerName,
        
        [switch]$Follow,
        [switch]$Tail,
        [int]$Lines = 100
    )
    
    if (!(Test-DockerInstallation)) {
        return
    }
    
    try {
        $args = @('logs')
        if ($Follow) { $args += '-f' }
        if ($Tail) { $args += "--tail=$Lines" }
        $args += $ContainerName
        
        $logs = docker $args
        if ($LASTEXITCODE -eq 0) {
            Write-Host $logs
            return $logs
        }
    }
    catch {
        $errorMessage = $_.Exception.Message
        Write-Host ("Failed to get logs for container {0}: {1}" -f $ContainerName, $errorMessage) -ForegroundColor Red
    }
}
