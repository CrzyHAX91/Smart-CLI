#!/usr/bin/env pwsh
param(
    [Parameter(Position = 0)]
    [string]$Module,
    
    [Parameter(Position = 1)]
    [string]$Command,
    
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Arguments,
    
    [switch]$Version,
    [switch]$Help
)

# Version information
$SMARTCLI_VERSION = "1.0.0"

# Script configuration
$ErrorActionPreference = "Stop"
$PSDefaultParameterValues['*:ErrorAction'] = 'Stop'

# Get the script's directory
$ScriptPath = $PSScriptRoot
if (!$ScriptPath) {
    $ScriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
}

# Initialize paths
$ModulesPath = Join-Path $ScriptPath "Modules"
$ConfigPath = Join-Path $ScriptPath "config"
$LogPath = Join-Path $ScriptPath "logs"

# Ensure required directories exist
@($ModulesPath, $ConfigPath, $LogPath) | ForEach-Object {
    if (!(Test-Path $_)) {
        New-Item -ItemType Directory -Path $_ -Force | Out-Null
    }
}

# Function to write colored output
function Write-ColorOutput {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Message,
        
        [Parameter(Mandatory = $false)]
        [string]$ForegroundColor = "White"
    )
    
    Write-Host $Message -ForegroundColor $ForegroundColor
}

# Function to display help
function Show-Help {
    Write-ColorOutput "SmartCLI - A powerful CLI tool for developers" -ForegroundColor Cyan
    Write-ColorOutput "`nUsage:" -ForegroundColor Yellow
    Write-ColorOutput "  smartcli <module> <command> [arguments]"
    Write-ColorOutput "  smartcli --version"
    Write-ColorOutput "  smartcli --help"
    
    Write-ColorOutput "`nAvailable Modules:" -ForegroundColor Yellow
    Get-ChildItem -Path $ModulesPath -Filter "*.ps1" | ForEach-Object {
        $moduleName = $_.BaseName
        if ($moduleName -ne "install_smartcli") {
            Write-ColorOutput "  - $moduleName"
        }
    }
    
    Write-ColorOutput "`nExamples:" -ForegroundColor Yellow
    Write-ColorOutput "  smartcli docker ps"
    Write-ColorOutput "  smartcli k8s get pods"
    Write-ColorOutput "  smartcli ai explain 'docker run'"
    Write-ColorOutput "  smartcli ssh list"
    
    Write-ColorOutput "`nFor module-specific help:" -ForegroundColor Yellow
    Write-ColorOutput "  smartcli <module> --help"
}

# Function to validate module
function Test-Module {
    param([string]$ModuleName)
    
    $modulePath = Join-Path $ModulesPath "$ModuleName.ps1"
    return Test-Path $modulePath
}

# Function to import and execute module
function Invoke-Module {
    param(
        [string]$ModuleName,
        [string]$Command,
        [string[]]$Arguments
    )
    
    $modulePath = Join-Path $ModulesPath "$ModuleName.ps1"
    
    try {
        # Import module
        . $modulePath
        
        # Get available commands in module
        $moduleCommands = Get-Command -Module $ModuleName -ErrorAction SilentlyContinue
        
        # Execute command if available
        if ($moduleCommands -contains $Command) {
            & $Command @Arguments
        }
        else {
            Write-ColorOutput "Error: Command '$Command' not found in module '$ModuleName'" -ForegroundColor Red
            Write-ColorOutput "Available commands:" -ForegroundColor Yellow
            $moduleCommands | ForEach-Object {
                Write-ColorOutput "  - $($_.Name)"
            }
            exit 1
        }
    }
    catch {
        Write-ColorOutput "Error executing module '$ModuleName': $_" -ForegroundColor Red
        exit 1
    }
}

# Main execution logic
if ($Version) {
    Write-ColorOutput "SmartCLI version $SMARTCLI_VERSION"
    exit 0
}

if ($Help -or (!$Module -and !$Command)) {
    Show-Help
    exit 0
}

# Validate and execute module
if (Test-Module $Module) {
    Invoke-Module -ModuleName $Module -Command $Command -Arguments $Arguments
}
else {
    Write-ColorOutput "Error: Module '$Module' not found" -ForegroundColor Red
    Write-ColorOutput "Run 'smartcli --help' to see available modules" -ForegroundColor Yellow
    exit 1
}
