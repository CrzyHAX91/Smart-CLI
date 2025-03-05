# SSH Module - Connection Management and Remote Access
# Version: 1.0.0

# Configuration path for storing SSH connections
$sshConfigPath = Join-Path $env:USERPROFILE ".smartcli/ssh"
$sshConfigFile = Join-Path $sshConfigPath "connections.json"

# Ensure SSH configuration directory exists
function Initialize-SSHConfig {
    try {
        if (-not (Test-Path $sshConfigPath)) {
            New-Item -ItemType Directory -Path $sshConfigPath -Force | Out-Null
            Write-Log "Created SSH configuration directory" -Level Info
        }
        
        if (-not (Test-Path $sshConfigFile)) {
            Set-Content -Path $sshConfigFile -Value "{`"connections`": []}" -Force
            Write-Log "Initialized SSH connections file" -Level Info
        }
    }
    catch {
        Write-Log "Error initializing SSH configuration: $_" -Level Error
        Write-Host "Error: Failed to initialize SSH configuration" -ForegroundColor Red
    }
}

# Load SSH connections
function Get-SSHConnections {
    try {
        Initialize-SSHConfig
        $config = Get-Content -Path $sshConfigFile | ConvertFrom-Json
        return $config.connections
    }
    catch {
        Write-Log "Error loading SSH connections: $_" -Level Error
        Write-Host "Error: Failed to load SSH connections" -ForegroundColor Red
        return @()
    }
}

# Save SSH connections
function Save-SSHConnections {
    param(
        [Parameter(Mandatory=$true)]
        [array]$connections
    )
    
    try {
        Initialize-SSHConfig
        $config = @{
            connections = $connections
        }
        $config | ConvertTo-Json | Set-Content -Path $sshConfigFile -Force
        Write-Log "Saved SSH connections configuration" -Level Info
    }
    catch {
        Write-Log "Error saving SSH connections: $_" -Level Error
        Write-Host "Error: Failed to save SSH connections" -ForegroundColor Red
    }
}

# List SSH connections
function List-SSHConnections {
    try {
        $connections = Get-SSHConnections
        
        if ($connections.Count -eq 0) {
            Write-Host "No saved SSH connections found." -ForegroundColor Yellow
            Write-Host "Use 'smartcli ssh add' to add a new connection." -ForegroundColor Cyan
            return
        }
        
        Write-Host "`nSaved SSH Connections:" -ForegroundColor Cyan
        Write-Host "=====================`n" -ForegroundColor Cyan
        
        foreach ($conn in $connections) {
            Write-Host "Name: " -NoNewline -ForegroundColor White
            Write-Host "$($conn.name)" -ForegroundColor Green
            Write-Host "Host: $($conn.host)"
            Write-Host "User: $($conn.username)"
            Write-Host "Port: $($conn.port)`n"
        }
    }
    catch {
        Write-Log "Error listing SSH connections: $_" -Level Error
        Write-Host "Error: Failed to list SSH connections" -ForegroundColor Red
    }
}

# Add new SSH connection
function Add-SSHConnection {
    param(
        [Parameter(Mandatory=$true)]
        [string]$name,
        [Parameter(Mandatory=$true)]
        [string]$host,
        [Parameter(Mandatory=$true)]
        [string]$username,
        [int]$port = 22,
        [string]$keyPath
    )
    
    try {
        $connections = Get-SSHConnections
        
        # Check if connection name already exists
        if ($connections | Where-Object { $_.name -eq $name }) {
            Write-Host "Error: Connection name '$name' already exists" -ForegroundColor Red
            return
        }
        
        # Validate key file if provided
        if ($keyPath -and -not (Test-Path $keyPath)) {
            Write-Host "Error: SSH key file not found at '$keyPath'" -ForegroundColor Red
            return
        }
        
        $newConnection = @{
            name = $name
            host = $host
            username = $username
            port = $port
            keyPath = $keyPath
        }
        
        $connections += $newConnection
        Save-SSHConnections -connections $connections
        
        Write-Host "SSH connection '$name' added successfully" -ForegroundColor Green
    }
    catch {
        Write-Log "Error adding SSH connection: $_" -Level Error
        Write-Host "Error: Failed to add SSH connection" -ForegroundColor Red
    }
}

# Remove SSH connection
function Remove-SSHConnection {
    param(
        [Parameter(Mandatory=$true)]
        [string]$name
    )
    
    try {
        $connections = Get-SSHConnections
        $newConnections = $connections | Where-Object { $_.name -ne $name }
        
        if ($connections.Count -eq $newConnections.Count) {
            Write-Host "Error: Connection '$name' not found" -ForegroundColor Red
            return
        }
        
        Save-SSHConnections -connections $newConnections
        Write-Host "SSH connection '$name' removed successfully" -ForegroundColor Green
    }
    catch {
        Write-Log "Error removing SSH connection: $_" -Level Error
        Write-Host "Error: Failed to remove SSH connection" -ForegroundColor Red
    }
}

# Connect to SSH host
function Connect-SSHHost {
    param(
        [Parameter(Mandatory=$true)]
        [string]$name
    )
    
    try {
        $connections = Get-SSHConnections
        $connection = $connections | Where-Object { $_.name -eq $name }
        
        if (-not $connection) {
            Write-Host "Error: Connection '$name' not found" -ForegroundColor Red
            return
        }
        
        $sshCommand = "ssh"
        
        if ($connection.keyPath) {
            $sshCommand += " -i `"$($connection.keyPath)`""
        }
        
        $sshCommand += " -p $($connection.port) $($connection.username)@$($connection.host)"
        
        Write-Log "Connecting to SSH host: $($connection.host)" -Level Info
        Write-Host "Connecting to $($connection.host)..." -ForegroundColor Cyan
        
        Invoke-Expression $sshCommand
    }
    catch {
        Write-Log "Error connecting to SSH host: $_" -Level Error
        Write-Host "Error: Failed to establish SSH connection" -ForegroundColor Red
    }
}

# Show SSH command help
function Show-SSHHelp {
    $help = @"
SSH Commands:
    list                List saved connections
    add                 Add a new connection
    remove <name>       Remove a connection
    connect <name>      Connect to a saved host

Options for 'add':
    -name <name>       Connection name
    -host <host>       Hostname or IP address
    -user <username>   SSH username
    -port <port>       SSH port (default: 22)
    -key <path>        Path to SSH key file

Examples:
    smartcli ssh list
    smartcli ssh add -name dev-server -host example.com -user admin
    smartcli ssh add -name prod-server -host 10.0.0.1 -user root -port 2222 -key ~/.ssh/id_rsa
    smartcli ssh connect dev-server
    smartcli ssh remove dev-server
"@
    
    Write-Host $help -ForegroundColor Cyan
}

# Process SSH commands
function Process-SSHCommand {
    param(
        [string[]]$arguments
    )
    
    try {
        switch ($arguments[0]) {
            "list" {
                List-SSHConnections
            }
            "add" {
                if ($arguments.Length -lt 7) {
                    Write-Host "Error: Required parameters missing" -ForegroundColor Red
                    Write-Host "Usage: smartcli ssh add -name <name> -host <host> -user <username> [-port <port>] [-key <path>]" -ForegroundColor Yellow
                    return
                }
                
                $params = @{}
                for ($i = 1; $i -lt $arguments.Length; $i += 2) {
                    switch ($arguments[$i]) {
                        "-name" { $params.name = $arguments[$i + 1] }
                        "-host" { $params.host = $arguments[$i + 1] }
                        "-user" { $params.username = $arguments[$i + 1] }
                        "-port" { $params.port = [int]$arguments[$i + 1] }
                        "-key" { $params.keyPath = $arguments[$i + 1] }
                    }
                }
                
                Add-SSHConnection @params
            }
            "remove" {
                if ($arguments.Length -lt 2) {
                    Write-Host "Error: Connection name required" -ForegroundColor Red
                    return
                }
                Remove-SSHConnection -name $arguments[1]
            }
            "connect" {
                if ($arguments.Length -lt 2) {
                    Write-Host "Error: Connection name required" -ForegroundColor Red
                    return
                }
                Connect-SSHHost -name $arguments[1]
            }
            "help" {
                Show-SSHHelp
            }
            default {
                Write-Host "Unknown SSH command. Use 'smartcli ssh help' for usage." -ForegroundColor Yellow
            }
        }
    }
    catch {
        Write-Log "Error processing SSH command: $_" -Level Error
        Write-Host "Error: Failed to process SSH command" -ForegroundColor Red
    }
}

# Export functions
Export-ModuleMember -Function Process-SSHCommand, Show-SSHHelp
