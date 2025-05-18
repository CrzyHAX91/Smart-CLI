# Tasks Module - Task Automation and Scheduling
# Version: 1.0.0

# Configuration paths
$tasksConfigPath = Join-Path $env:USERPROFILE ".smartcli/tasks"
$tasksConfigFile = Join-Path $tasksConfigPath "tasks.json"
$tasksHistoryFile = Join-Path $tasksConfigPath "history.json"

# Initialize tasks configuration
function Initialize-TasksConfig {
    try {
        if (-not (Test-Path $tasksConfigPath)) {
            New-Item -ItemType Directory -Path $tasksConfigPath -Force | Out-Null
            Write-Log "Created tasks configuration directory" -Level Info
        }
        
        if (-not (Test-Path $tasksConfigFile)) {
            Set-Content -Path $tasksConfigFile -Value "{`"tasks`": []}" -Force
            Write-Log "Initialized tasks configuration file" -Level Info
        }
        
        if (-not (Test-Path $tasksHistoryFile)) {
            Set-Content -Path $tasksHistoryFile -Value "{`"history`": []}" -Force
            Write-Log "Initialized tasks history file" -Level Info
        }
    }
    catch {
        Write-Log "Error initializing tasks configuration: $_" -Level Error
        Write-Host "Error: Failed to initialize tasks configuration" -ForegroundColor Red
    }
}

# Load tasks
function Get-Tasks {
    try {
        Initialize-TasksConfig
        $config = Get-Content -Path $tasksConfigFile | ConvertFrom-Json
        return $config.tasks
    }
    catch {
        Write-Log "Error loading tasks: $_" -Level Error
        Write-Host "Error: Failed to load tasks" -ForegroundColor Red
        return @()
    }
}

# Save tasks
function Save-Tasks {
    param(
        [Parameter(Mandatory=$true)]
        [array]$tasks
    )
    
    try {
        Initialize-TasksConfig
        $config = @{
            tasks = $tasks
        }
        $config | ConvertTo-Json -Depth 10 | Set-Content -Path $tasksConfigFile -Force
        Write-Log "Saved tasks configuration" -Level Info
    }
    catch {
        Write-Log "Error saving tasks: $_" -Level Error
        Write-Host "Error: Failed to save tasks" -ForegroundColor Red
    }
}

# Add task execution to history
function Add-TaskHistory {
    param(
        [Parameter(Mandatory=$true)]
        [string]$taskName,
        [Parameter(Mandatory=$true)]
        [bool]$success,
        [string]$error = ""
    )
    
    try {
        $history = Get-Content -Path $tasksHistoryFile | ConvertFrom-Json
        
        $historyEntry = @{
            taskName = $taskName
            timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
            success = $success
            error = $error
        }
        
        $history.history += $historyEntry
        $history | ConvertTo-Json -Depth 10 | Set-Content -Path $tasksHistoryFile -Force
        Write-Log "Added task execution to history: $taskName" -Level Info
    }
    catch {
        Write-Log "Error adding task history: $_" -Level Error
    }
}

# List tasks
function List-Tasks {
    try {
        $tasks = Get-Tasks
        
        if ($tasks.Count -eq 0) {
            Write-Host "No tasks defined." -ForegroundColor Yellow
            Write-Host "Use 'smartcli task create' to create a new task." -ForegroundColor Cyan
            return
        }
        
        Write-Host "`nDefined Tasks:" -ForegroundColor Cyan
        Write-Host "=============`n" -ForegroundColor Cyan
        
        foreach ($task in $tasks) {
            Write-Host "Name: " -NoNewline -ForegroundColor White
            Write-Host "$($task.name)" -ForegroundColor Green
            Write-Host "Description: $($task.description)"
            Write-Host "Commands: $($task.commands.Count) steps"
            if ($task.schedule) {
                Write-Host "Schedule: $($task.schedule)"
            }
            Write-Host ""
        }
    }
    catch {
        Write-Log "Error listing tasks: $_" -Level Error
        Write-Host "Error: Failed to list tasks" -ForegroundColor Red
    }
}

# Create new task
function New-Task {
    param(
        [Parameter(Mandatory=$true)]
        [string]$name,
        [Parameter(Mandatory=$true)]
        [string]$description,
        [Parameter(Mandatory=$true)]
        [array]$commands,
        [string]$schedule
    )
    
    try {
        $tasks = Get-Tasks
        
        # Check if task name already exists
        if ($tasks | Where-Object { $_.name -eq $name }) {
            Write-Host "Error: Task '$name' already exists" -ForegroundColor Red
            return
        }
        
        $newTask = @{
            name = $name
            description = $description
            commands = $commands
            schedule = $schedule
            created = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        }
        
        $tasks += $newTask
        Save-Tasks -tasks $tasks
        
        Write-Host "Task '$name' created successfully" -ForegroundColor Green
    }
    catch {
        Write-Log "Error creating task: $_" -Level Error
        Write-Host "Error: Failed to create task" -ForegroundColor Red
    }
}

# Remove task
function Remove-Task {
    param(
        [Parameter(Mandatory=$true)]
        [string]$name
    )
    
    try {
        $tasks = Get-Tasks
        $newTasks = $tasks | Where-Object { $_.name -ne $name }
        
        if ($tasks.Count -eq $newTasks.Count) {
            Write-Host "Error: Task '$name' not found" -ForegroundColor Red
            return
        }
        
        Save-Tasks -tasks $newTasks
        Write-Host "Task '$name' removed successfully" -ForegroundColor Green
    }
    catch {
        Write-Log "Error removing task: $_" -Level Error
        Write-Host "Error: Failed to remove task" -ForegroundColor Red
    }
}

# Run task
function Start-Task {
    param(
        [Parameter(Mandatory=$true)]
        [string]$name
    )
    
    try {
        $tasks = Get-Tasks
        $task = $tasks | Where-Object { $_.name -eq $name }
        
        if (-not $task) {
            Write-Host "Error: Task '$name' not found" -ForegroundColor Red
            return
        }
        
        Write-Host "Running task '$name'..." -ForegroundColor Cyan
        Write-Host "Description: $($task.description)" -ForegroundColor White
        Write-Host ""
        
        $success = $true
        $errorMessage = ""
        
        foreach ($command in $task.commands) {
            Write-Host "Executing: $command" -ForegroundColor Yellow
            try {
                Invoke-Expression $command
                Write-Host "Command completed successfully" -ForegroundColor Green
                Write-Host ""
            }
            catch {
                $success = $false
                $errorMessage = $_.Exception.Message
                Write-Host "Command failed: $_" -ForegroundColor Red
                Write-Host ""
                break
            }
        }
        
        Add-TaskHistory -taskName $name -success $success -error $errorMessage
        
        if ($success) {
            Write-Host "Task '$name' completed successfully" -ForegroundColor Green
        }
        else {
            Write-Host "Task '$name' failed" -ForegroundColor Red
        }
    }
    catch {
        Write-Log "Error running task: $_" -Level Error
        Write-Host "Error: Failed to run task" -ForegroundColor Red
        Add-TaskHistory -taskName $name -success $false -error $_.Exception.Message
    }
}

# Show task history
function Show-TaskHistory {
    param(
        [string]$taskName,
        [int]$limit = 10
    )
    
    try {
        $history = Get-Content -Path $tasksHistoryFile | ConvertFrom-Json
        $entries = $history.history
        
        if ($taskName) {
            $entries = $entries | Where-Object { $_.taskName -eq $taskName }
        }
        
        $entries = $entries | Select-Object -Last $limit
        
        if ($entries.Count -eq 0) {
            Write-Host "No task execution history found." -ForegroundColor Yellow
            return
        }
        
        Write-Host "`nTask Execution History:" -ForegroundColor Cyan
        Write-Host "=====================`n" -ForegroundColor Cyan
        
        foreach ($entry in $entries) {
            Write-Host "Task: " -NoNewline -ForegroundColor White
            Write-Host "$($entry.taskName)" -ForegroundColor Green
            Write-Host "Time: $($entry.timestamp)"
            Write-Host "Status: " -NoNewline
            if ($entry.success) {
                Write-Host "Success" -ForegroundColor Green
            }
            else {
                Write-Host "Failed" -ForegroundColor Red
                if ($entry.error) {
                    Write-Host "Error: $($entry.error)" -ForegroundColor Red
                }
            }
            Write-Host ""
        }
    }
    catch {
        Write-Log "Error showing task history: $_" -Level Error
        Write-Host "Error: Failed to show task history" -ForegroundColor Red
    }
}

# Show tasks command help
function Show-TasksHelp {
    $help = @"
Tasks Commands:
    list                    List all defined tasks
    create                  Create a new task
    remove <name>           Remove a task
    run <name>             Run a task
    history [name]         Show task execution history

Options for 'create':
    -name <name>           Task name
    -desc <description>    Task description
    -cmd <commands...>     Commands to execute
    -schedule <cron>       Optional schedule (cron format)

Examples:
    smartcli task list
    smartcli task create -name backup -desc "Backup files" -cmd "xcopy /s /e /i src dest"
    smartcli task run backup
    smartcli task history backup
    smartcli task remove backup
"@
    
    Write-Host $help -ForegroundColor Cyan
}

# Process task commands
function Process-TaskCommand {
    param(
        [string[]]$arguments
    )
    
    try {
        switch ($arguments[0]) {
            "list" {
                List-Tasks
            }
            "create" {
                if ($arguments.Length -lt 7) {
                    Write-Host "Error: Required parameters missing" -ForegroundColor Red
                    Write-Host "Usage: smartcli task create -name <name> -desc <description> -cmd <command1> [command2...]" -ForegroundColor Yellow
                    return
                }
                
                $params = @{}
                $commands = @()
                $i = 1
                while ($i -lt $arguments.Length) {
                    switch ($arguments[$i]) {
                        "-name" { 
                            $params.name = $arguments[$i + 1]
                            $i += 2
                        }
                        "-desc" { 
                            $params.description = $arguments[$i + 1]
                            $i += 2
                        }
                        "-cmd" { 
                            $i++
                            while ($i -lt $arguments.Length -and -not $arguments[$i].StartsWith("-")) {
                                $commands += $arguments[$i]
                                $i++
                            }
                            continue
                        }
                        "-schedule" { 
                            $params.schedule = $arguments[$i + 1]
                            $i += 2
                        }
                        default { $i++ }
                    }
                }
                
                $params.commands = $commands
                New-Task @params
            }
            "remove" {
                if ($arguments.Length -lt 2) {
                    Write-Host "Error: Task name required" -ForegroundColor Red
                    return
                }
                Remove-Task -name $arguments[1]
            }
            "run" {
                if ($arguments.Length -lt 2) {
                    Write-Host "Error: Task name required" -ForegroundColor Red
                    return
                }
                Start-Task -name $arguments[1]
            }
            "history" {
                $params = @{}
                if ($arguments.Length -gt 1) {
                    $params.taskName = $arguments[1]
                }
                Show-TaskHistory @params
            }
            "help" {
                Show-TasksHelp
            }
            default {
                Write-Host "Unknown task command. Use 'smartcli task help' for usage." -ForegroundColor Yellow
            }
        }
    }
    catch {
        Write-Log "Error processing task command: $_" -Level Error
        Write-Host "Error: Failed to process task command" -ForegroundColor Red
    }
}

# Export functions
Export-ModuleMember -Function Process-TaskCommand, Show-TasksHelp
