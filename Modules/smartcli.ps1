# SmartCLI - Modern PowerShell-based CLI tool
# Version: 1.0.0

$ErrorActionPreference = "Stop"
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$modulesPath = "$scriptPath\modules"
$logPath = "$scriptPath\logs"

# Create logs directory if it doesn't exist
if (-not (Test-Path $logPath)) {
    New-Item -ItemType Directory -Path $logPath | Out-Null
}

# Initialize logging
$logFile = Join-Path $logPath "smartcli-$(Get-Date -Format 'yyyy-MM-dd').log"

function Write-Log {
    param(
        [Parameter(Mandatory=$true)]
        [string]$Message,
        [ValidateSet('Info', 'Warning', 'Error')]
        [string]$Level = 'Info'
    )
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] [$Level] $Message"
    
    # Write to log file
    Add-Content -Path $logFile -Value $logMessage
    
    # Write to console with colors
    switch ($Level) {
        'Info'    { Write-Host $logMessage -ForegroundColor Cyan }
        'Warning' { Write-Host $logMessage -ForegroundColor Yellow }
        'Error'   { Write-Host $logMessage -ForegroundColor Red }
    }
}

function Show-Banner {
    $banner = @"
    ╔═══════════════════════════════════════╗
    ║             Smart CLI v1.0.0          ║
    ║     Modern Development Tools Suite    ║
    ╚═══════════════════════════════════════╝
"@
    Write-Host $banner -ForegroundColor Cyan
}

function Show-Help {
    $help = @"
    
Available Commands:
    docker  - Docker container management
    k8s     - Kubernetes operations
    ssh     - SSH connection management
    task    - Task automation
    help    - Show this help message

Usage:
    smartcli <command> [options]

Examples:
    smartcli docker ps        - List all Docker containers
    smartcli k8s get pods    - List Kubernetes pods
    smartcli ssh list        - List SSH connections
    smartcli task list       - List available tasks
"@
    Write-Host $help -ForegroundColor White
}

# Load core modules
try {
    . "$modulesPath\ai.ps1"
    Write-Log "AI module loaded successfully" -Level Info
} catch {
    Write-Log "Failed to load AI module: $_" -Level Error
    exit 1
}

# Parse command line arguments
param (
    [string]$command,
    [string[]]$arguments
)

# Show banner
Show-Banner

# Main command processing
try {
    switch ($command) {
        "docker" {
            . "$modulesPath\docker.ps1"
            Write-Log "Docker command executed: $arguments" -Level Info
        }
        "k8s" {
            . "$modulesPath\k8s.ps1"
            Write-Log "Kubernetes command executed: $arguments" -Level Info
        }
        "ssh" {
            . "$modulesPath\ssh.ps1"
            Write-Log "SSH command executed: $arguments" -Level Info
        }
        "task" {
            . "$modulesPath\tasks.ps1"
            Write-Log "Task command executed: $arguments" -Level Info
        }
        "help" {
            Show-Help
        }
        "" {
            Show-Help
            Write-Log "Help displayed - no command specified" -Level Info
        }
        default {
            $suggestion = Get-AISuggestion $command
            Write-Log "Unknown command attempted: '$command'" -Level Warning
            Write-Host "`nUnknown command: '$command'" -ForegroundColor Yellow
            if ($suggestion) {
                Write-Host "Did you mean: '$suggestion'?" -ForegroundColor Cyan
                Write-Host "Use 'smartcli help' for available commands`n" -ForegroundColor White
            }
        }
    }
} catch {
    Write-Log "Error executing command '$command': $_" -Level Error
    Write-Host "`nError: $_" -ForegroundColor Red
    Write-Host "Use 'smartcli help' for usage information`n" -ForegroundColor White
    exit 1
}
