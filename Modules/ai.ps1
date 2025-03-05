# AI Module - Provides intelligent suggestions and command assistance
# Version: 1.0.0

# Import required modules
using namespace System.Text

function Get-LevenshteinDistance {
    param(
        [string]$s1,
        [string]$s2
    )
    
    $len1 = $s1.Length
    $len2 = $s2.Length
    
    # Initialize matrix
    $matrix = New-Object 'int[,]' ($len1 + 1), ($len2 + 1)
    
    # Initialize first column and row
    for ($i = 0; $i -le $len1; $i++) { $matrix[$i, 0] = $i }
    for ($j = 0; $j -le $len2; $j++) { $matrix[0, $j] = $j }
    
    # Fill rest of the matrix
    for ($i = 1; $i -le $len1; $i++) {
        for ($j = 1; $j -le $len2; $j++) {
            $cost = if ($s1[$i-1] -eq $s2[$j-1]) { 0 } else { 1 }
            $matrix[$i, $j] = [Math]::Min(
                [Math]::Min(
                    $matrix[($i-1), $j] + 1,      # Deletion
                    $matrix[$i, ($j-1)] + 1       # Insertion
                ),
                $matrix[($i-1), ($j-1)] + $cost   # Substitution
            )
        }
    }
    
    return $matrix[$len1, $len2]
}

function Get-AISuggestion {
    param(
        [Parameter(Mandatory=$true)]
        [string]$input
    )
    
    try {
        # Define available commands with descriptions
        $commands = @{
            "docker" = "Manage Docker containers and images"
            "k8s" = "Kubernetes operations and cluster management"
            "ssh" = "SSH connection management and remote access"
            "task" = "Task automation and scheduling"
            "help" = "Show help and usage information"
            "version" = "Show SmartCLI version"
            "config" = "Configure SmartCLI settings"
            "update" = "Check for and install updates"
        }
        
        $bestMatch = ""
        $minDistance = 999
        $threshold = 3  # Maximum acceptable Levenshtein distance
        
        # Convert input to lowercase for case-insensitive comparison
        $inputLower = $input.ToLower()
        
        foreach ($cmd in $commands.Keys) {
            # Check for exact match first
            if ($cmd -eq $inputLower) {
                return @{
                    Command = $cmd
                    Description = $commands[$cmd]
                    Confidence = 1.0
                }
            }
            
            # Calculate Levenshtein distance
            $distance = Get-LevenshteinDistance $inputLower $cmd
            
            # Update best match if this is better
            if ($distance -lt $minDistance) {
                $minDistance = $distance
                $bestMatch = $cmd
            }
        }
        
        # Return suggestion only if it's close enough
        if ($minDistance -le $threshold) {
            return @{
                Command = $bestMatch
                Description = $commands[$bestMatch]
                Confidence = [math]::Max(0, 1 - ($minDistance / 5))  # Scale confidence between 0 and 1
            }
        }
        
        # No good match found
        return $null
    }
    catch {
        Write-Log "Error in Get-AISuggestion: $_" -Level Error
        return $null
    }
}

function Get-CommandHelp {
    param(
        [Parameter(Mandatory=$true)]
        [string]$command
    )
    
    try {
        $helpText = switch ($command) {
            "docker" {
@"
Docker Command Usage:
    smartcli docker ps          - List all containers
    smartcli docker start <id>  - Start a container
    smartcli docker stop <id>   - Stop a container
    smartcli docker logs <id>   - View container logs
"@
            }
            "k8s" {
@"
Kubernetes Command Usage:
    smartcli k8s get pods       - List all pods
    smartcli k8s get services   - List all services
    smartcli k8s describe <pod> - Describe a pod
"@
            }
            "ssh" {
@"
SSH Command Usage:
    smartcli ssh list          - List saved connections
    smartcli ssh connect <name> - Connect to a saved host
    smartcli ssh add <name>    - Add a new connection
"@
            }
            "task" {
@"
Task Command Usage:
    smartcli task list         - List available tasks
    smartcli task run <name>   - Run a specific task
    smartcli task create      - Create a new task
"@
            }
            default {
                "No detailed help available for '$command'"
            }
        }
        
        return $helpText
    }
    catch {
        Write-Log "Error getting help for command '$command': $_" -Level Error
        return "Error retrieving help information."
    }
}

# Export functions
Export-ModuleMember -Function Get-AISuggestion, Get-CommandHelp
