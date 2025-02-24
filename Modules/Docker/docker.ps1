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
$DOCKER_MODULE_VERSION = "1.0.0"

# Check if Docker is installed
function Test-DockerInstallation {
    try {
        $dockerVersion = docker version --format '{{.Server.Version}}'
        if ($LASTEXITCODE -eq 0) {
            Write-SmartOutput "Docker version $dockerVersion detected" -ForegroundColor Green
            return $true
        }
    }
    catch {
        Write-SmartError "Docker is not installed or not running"
        return $false
    }
}

# List containers
function Get-DockerContainers {
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
            Write-SmartOutput $containers
            return $containers
        }
    }
    catch {
        Write-SmartError "Failed to list containers" -ErrorRecord $_
    }
}

# List images
function Get-DockerImages {
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
            Write-SmartOutput $images
            return $images
        }
    }
    catch {
        Write-SmartError "Failed to list images" -ErrorRecord $_
    }
}

# Start container
function Start-DockerContainer {
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
            Write-SmartOutput "Container $ContainerName started successfully" -ForegroundColor Green
            return $true
        }
    }
    catch {
        Write-SmartError "Failed to start container $ContainerName" -ErrorRecord $_
        return $false
    }
}

# Stop container
function Stop-DockerContainer {
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
            Write-SmartOutput "Container $ContainerName stopped successfully" -ForegroundColor Green
            return $true
        }
    }
    catch {
        Write-SmartError "Failed to stop container $ContainerName" -ErrorRecord $_
        return $false
    }
}

# Get container logs
function Get-DockerLogs {
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
            Write-SmartOutput $logs
            return $logs
        }
    }
    catch {
        Write-SmartError "Failed to get logs for container $ContainerName" -ErrorRecord $_
    }
}

# Export functions
Export-ModuleMember -Function Get-DockerContainers, Get-DockerImages, Start-DockerContainer, Stop-DockerContainer, Get-DockerLogs
