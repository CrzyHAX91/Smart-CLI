# SmartCLI Installation Script for Windows
param(
    [switch]$Uninstall,
    [string]$CustomPath
)

# Version information
$SMARTCLI_VERSION = "1.0.0"

# Configuration
$defaultInstallPath = Join-Path $env:USERPROFILE "SmartCLI"
$installPath = if ($CustomPath) { $CustomPath } else { $defaultInstallPath }
$modulesPath = Join-Path $installPath "Modules"
$logFile = Join-Path $installPath "install_log.txt"
$backupPath = Join-Path $env:TEMP "SmartCLI_Backup"

# Function to handle logging
function Write-Log {
    param(
        [string]$Message,
        [ValidateSet('Info', 'Warning', 'Error')]
        [string]$Level = 'Info'
    )
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "$timestamp [$Level] - $Message"
    
    # Create log directory if it doesn't exist
    $logDir = Split-Path $logFile -Parent
    if (!(Test-Path $logDir)) {
        New-Item -ItemType Directory -Path $logDir -Force | Out-Null
    }
    
    Add-Content -Path $logFile -Value $logMessage
    
    # Output to console with color
    switch ($Level) {
        'Warning' { Write-Host $logMessage -ForegroundColor Yellow }
        'Error' { Write-Host $logMessage -ForegroundColor Red }
        default { Write-Host $logMessage }
    }
}

# Function to backup existing installation
function Backup-ExistingInstallation {
    if (Test-Path $installPath) {
        Write-Log "Creating backup of existing installation..." -Level Warning
        try {
            if (Test-Path $backupPath) {
                Remove-Item $backupPath -Recurse -Force
            }
            Copy-Item -Path $installPath -Destination $backupPath -Recurse -Force
            Write-Log "Backup created successfully at: $backupPath"
        }
        catch {
            Write-Log "Failed to create backup: $_" -Level Error
            exit 1
        }
    }
}

# Function to restore from backup
function Restore-FromBackup {
    if (Test-Path $backupPath) {
        Write-Log "Restoring from backup..." -Level Warning
        try {
            if (Test-Path $installPath) {
                Remove-Item $installPath -Recurse -Force
            }
            Copy-Item -Path $backupPath -Destination $installPath -Recurse -Force
            Write-Log "Restoration completed successfully"
        }
        catch {
            Write-Log "Failed to restore from backup: $_" -Level Error
            exit 1
        }
    }
}

# Function to uninstall SmartCLI
function Uninstall-SmartCLI {
    Write-Log "Starting uninstallation process..." -Level Warning
    
    # Remove from PATH
    $envPath = [System.Environment]::GetEnvironmentVariable("Path", [System.EnvironmentVariableTarget]::User)
    $envPath = ($envPath.Split(';') | Where-Object { $_ -notlike "*SmartCLI*" }) -join ';'
    [System.Environment]::SetEnvironmentVariable("Path", $envPath, [System.EnvironmentVariableTarget]::User)
    
    # Remove installation directory
    if (Test-Path $installPath) {
        try {
            Remove-Item $installPath -Recurse -Force
            Write-Log "SmartCLI has been successfully uninstalled"
        }
        catch {
            Write-Log "Failed to remove installation directory: $_" -Level Error
            exit 1
        }
    }
    else {
        Write-Log "Installation directory not found. Nothing to uninstall."
    }
}

# Main installation logic
function Install-SmartCLI {
    Write-Log "Starting SmartCLI installation (Version: $SMARTCLI_VERSION)..."
    
    # Create installation directory
    if (!(Test-Path $installPath)) {
        try {
            New-Item -ItemType Directory -Path $installPath -Force | Out-Null
            Write-Log "Created installation directory: $installPath"
        }
        catch {
            Write-Log "Failed to create installation directory: $_" -Level Error
            exit 1
        }
    }
    
    # Copy SmartCLI files
    try {
        $sourceFiles = @(
            @{Source = ".\smartcli.ps1"; Destination = Join-Path $installPath "smartcli.ps1"},
            @{Source = ".\Modules"; Destination = $modulesPath}
        )
        
        foreach ($file in $sourceFiles) {
            if (Test-Path $file.Source) {
                Copy-Item -Path $file.Source -Destination $file.Destination -Force -Recurse
                Write-Log "Copied $($file.Source) to $($file.Destination)"
            }
            else {
                throw "Required file not found: $($file.Source)"
            }
        }
    }
    catch {
        Write-Log "Failed to copy SmartCLI files: $_" -Level Error
        Restore-FromBackup
        exit 1
    }
    
    # Add to PATH
    try {
        $userPath = [System.Environment]::GetEnvironmentVariable("Path", [System.EnvironmentVariableTarget]::User)
        if ($userPath -notlike "*$installPath*") {
            [System.Environment]::SetEnvironmentVariable(
                "Path",
                "$userPath;$installPath",
                [System.EnvironmentVariableTarget]::User
            )
            Write-Log "Added SmartCLI to PATH"
        }
    }
    catch {
        Write-Log "Failed to update PATH: $_" -Level Error
        Restore-FromBackup
        exit 1
    }
    
    # Set execution policy
    try {
        Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
        Write-Log "Set ExecutionPolicy to RemoteSigned for CurrentUser"
    }
    catch {
        Write-Log "Failed to set ExecutionPolicy: $_" -Level Warning
    }
    
    # Verify installation
    try {
        $testResult = & "$installPath\smartcli.ps1" --version
        if ($testResult -like "*$SMARTCLI_VERSION*") {
            Write-Log "✅ SmartCLI $SMARTCLI_VERSION installed successfully!"
            Write-Log "You can now use 'smartcli' from any terminal"
        }
        else {
            throw "Version verification failed"
        }
    }
    catch {
        Write-Log "Installation verification failed: $_" -Level Error
        Write-Log "Please try running 'smartcli --version' manually" -Level Warning
    }
}

# Main execution
try {
    if ($Uninstall) {
        Uninstall-SmartCLI
    }
    else {
        Backup-ExistingInstallation
        Install-SmartCLI
    }
}
catch {
    Write-Log "An unexpected error occurred: $_" -Level Error
    Restore-FromBackup
    exit 1
}
