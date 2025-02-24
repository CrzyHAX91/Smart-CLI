# Core module for SmartCLI
# Provides essential functionality used by other modules

$ErrorActionPreference = "Stop"

# Version information
$CORE_VERSION = "1.0.0"

# Function to write colored output
function Write-SmartOutput {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Message,
        
        [Parameter(Mandatory = $false)]
        [string]$ForegroundColor = "White",
        
        [Parameter(Mandatory = $false)]
        [switch]$NoNewline
    )
    
    Write-Host $Message -ForegroundColor $ForegroundColor -NoNewline:$NoNewline
}

# Function to handle errors
function Write-SmartError {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Message,
        
        [Parameter(Mandatory = $false)]
        [System.Management.Automation.ErrorRecord]$ErrorRecord
    )
    
    Write-SmartOutput "Error: $Message" -ForegroundColor Red
    if ($ErrorRecord) {
        Write-SmartOutput "Details: $($ErrorRecord.Exception.Message)" -ForegroundColor Red
    }
}

# Function to get configuration
function Get-SmartConfig {
    param(
        [Parameter(Mandatory = $true)]
        [string]$ConfigName
    )
    
    $configPath = Join-Path $PSScriptRoot "../../config/$ConfigName.json"
    if (Test-Path $configPath) {
        try {
            return Get-Content $configPath | ConvertFrom-Json
        }
        catch {
            Write-SmartError "Failed to load configuration: $ConfigName" -ErrorRecord $_
            return $null
        }
    }
    return $null
}

# Function to set configuration
function Set-SmartConfig {
    param(
        [Parameter(Mandatory = $true)]
        [string]$ConfigName,
        
        [Parameter(Mandatory = $true)]
        [object]$ConfigData
    )
    
    $configDir = Join-Path $PSScriptRoot "../../config"
    if (!(Test-Path $configDir)) {
        New-Item -ItemType Directory -Path $configDir -Force | Out-Null
    }
    
    $configPath = Join-Path $configDir "$ConfigName.json"
    try {
        $ConfigData | ConvertTo-Json -Depth 10 | Set-Content $configPath
        return $true
    }
    catch {
        Write-SmartError "Failed to save configuration: $ConfigName" -ErrorRecord $_
        return $false
    }
}

# Function to validate module dependencies
function Test-ModuleDependencies {
    param(
        [Parameter(Mandatory = $true)]
        [string[]]$RequiredModules
    )
    
    $missingModules = @()
    foreach ($module in $RequiredModules) {
        $modulePath = Join-Path $PSScriptRoot "../$module/$module.ps1"
        if (!(Test-Path $modulePath)) {
            $missingModules += $module
        }
    }
    
    if ($missingModules.Count -gt 0) {
        Write-SmartError "Missing required modules: $($missingModules -join ', ')"
        return $false
    }
    return $true
}

# Function to load module
function Import-SmartModule {
    param(
        [Parameter(Mandatory = $true)]
        [string]$ModuleName
    )
    
    $modulePath = Join-Path $PSScriptRoot "../$ModuleName/$ModuleName.ps1"
    if (Test-Path $modulePath) {
        try {
            . $modulePath
            return $true
        }
        catch {
            Write-SmartError "Failed to import module: $ModuleName" -ErrorRecord $_
            return $false
        }
    }
    else {
        Write-SmartError "Module not found: $ModuleName"
        return $false
    }
}

# Export functions
Export-ModuleMember -Function Write-SmartOutput, Write-SmartError, Get-SmartConfig, Set-SmartConfig, Test-ModuleDependencies, Import-SmartModule
