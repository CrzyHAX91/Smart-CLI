# Docker Module - Container and Image Management
# Version: 1.0.0

# Verify Docker installation
function Test-DockerInstallation {
    try {
        $dockerVersion = docker version --format '{{.Server.Version}}'
        Write-Log "Docker version $dockerVersion detected" -Level Info
        return $true
    }
    catch {
        Write-Log "Docker is not installed or not running: $_" -Level Error
        Write-Host "`nError: Docker is not installed or not running." -ForegroundColor Red
        Write-Host "Please install Docker and ensure the Docker daemon is running.`n" -ForegroundColor Yellow
        return $false
    }
}

# List containers with formatted output
function List-DockerContainers {
    param(
        [switch]$all
    )
    
    try {
        $format = "table {{.ID}}\t{{.Names}}\t{{.Status}}\t{{.Ports}}"
        if ($all) {
            Write-Log "Listing all Docker containers" -Level Info
            docker ps -a --format $format
        }
        else {
            Write-Log "Listing running Docker containers" -Level Info
            docker ps --format $format
        }
    }
    catch {
        Write-Log "Error listing containers: $_" -Level Error
        Write-Host "Error: Failed to list containers" -ForegroundColor Red
    }
}

# Start a container with error handling
function Start-DockerContainer {
    param(
        [Parameter(Mandatory=$true)]
        [string]$containerID
    )
    
    try {
        Write-Log "Starting container $containerID" -Level Info
        $result = docker start $containerID
        if ($result) {
            Write-Host "Container $containerID started successfully" -ForegroundColor Green
            # Show container status
            docker ps --filter "id=$containerID" --format "table {{.ID}}\t{{.Names}}\t{{.Status}}\t{{.Ports}}"
        }
    }
    catch {
        Write-Log "Error starting container $containerID: $_" -Level Error
        Write-Host "Error: Failed to start container $containerID" -ForegroundColor Red
    }
}

# Stop a container with error handling
function Stop-DockerContainer {
    param(
        [Parameter(Mandatory=$true)]
        [string]$containerID,
        [int]$timeout = 10
    )
    
    try {
        Write-Log "Stopping container $containerID (timeout: ${timeout}s)" -Level Info
        docker stop --time $timeout $containerID
        Write-Host "Container $containerID stopped successfully" -ForegroundColor Green
    }
    catch {
        Write-Log "Error stopping container $containerID: $_" -Level Error
        Write-Host "Error: Failed to stop container $containerID" -ForegroundColor Red
    }
}

# View container logs
function Get-DockerLogs {
    param(
        [Parameter(Mandatory=$true)]
        [string]$containerID,
        [switch]$follow,
        [int]$tail = 100
    )
    
    try {
        Write-Log "Viewing logs for container $containerID" -Level Info
        if ($follow) {
            docker logs --follow --tail $tail $containerID
        }
        else {
            docker logs --tail $tail $containerID
        }
    }
    catch {
        Write-Log "Error viewing logs for container $containerID: $_" -Level Error
        Write-Host "Error: Failed to retrieve logs for container $containerID" -ForegroundColor Red
    }
}

# Build image from Dockerfile
function Build-DockerImage {
    param(
        [Parameter(Mandatory=$true)]
        [string]$path,
        [Parameter(Mandatory=$true)]
        [string]$tag,
        [string[]]$buildArgs
    )
    
    try {
        Write-Log "Building Docker image: $tag" -Level Info
        $buildCommand = "docker build -t $tag"
        
        if ($buildArgs) {
            foreach ($arg in $buildArgs) {
                $buildCommand += " --build-arg $arg"
            }
        }
        
        $buildCommand += " $path"
        Invoke-Expression $buildCommand
        
        Write-Host "Image $tag built successfully" -ForegroundColor Green
    }
    catch {
        Write-Log "Error building image $tag: $_" -Level Error
        Write-Host "Error: Failed to build image $tag" -ForegroundColor Red
    }
}

# Run a container
function New-DockerContainer {
    param(
        [Parameter(Mandatory=$true)]
        [string]$image,
        [string]$name,
        [string[]]$ports,
        [string[]]$volumes,
        [string[]]$env,
        [string]$network,
        [switch]$detach
    )
    
    try {
        $runCommand = "docker run"
        if ($detach) { $runCommand += " -d" }
        if ($name) { $runCommand += " --name $name" }
        
        foreach ($port in $ports) {
            $runCommand += " -p $port"
        }
        
        foreach ($volume in $volumes) {
            $runCommand += " -v $volume"
        }
        
        foreach ($envVar in $env) {
            $runCommand += " -e $envVar"
        }
        
        if ($network) {
            $runCommand += " --network $network"
        }
        
        $runCommand += " $image"
        
        Write-Log "Running container from image $image" -Level Info
        Invoke-Expression $runCommand
        
        if ($name) {
            Write-Host "Container $name created successfully" -ForegroundColor Green
        }
        else {
            Write-Host "Container created successfully" -ForegroundColor Green
        }
    }
    catch {
        Write-Log "Error creating container from image $image: $_" -Level Error
        Write-Host "Error: Failed to create container" -ForegroundColor Red
    }
}

# Show Docker command help
function Show-DockerHelp {
    $help = @"
Docker Commands:
    ps [--all]              List containers (--all for all containers)
    start <container>       Start a container
    stop <container>        Stop a container
    logs <container>        View container logs
    build <path> -t <tag>  Build an image from Dockerfile
    run <image>            Run a container from an image

Options:
    --name    Container name
    -p        Port mapping (host:container)
    -v        Volume mapping (host:container)
    -e        Environment variable
    --network Network name
    -d        Run in detached mode

Examples:
    smartcli docker ps --all
    smartcli docker start my-container
    smartcli docker logs --follow my-container
    smartcli docker build . -t myapp:latest
    smartcli docker run -d -p 8080:80 nginx
"@
    
    Write-Host $help -ForegroundColor Cyan
}

# Process Docker commands
function Process-DockerCommand {
    param(
        [string[]]$arguments
    )
    
    if (-not (Test-DockerInstallation)) {
        return
    }
    
    try {
        switch ($arguments[0]) {
            "ps" {
                List-DockerContainers -all:($arguments -contains "--all")
            }
            "start" {
                if ($arguments.Length -lt 2) {
                    Write-Host "Error: Container ID required" -ForegroundColor Red
                    return
                }
                Start-DockerContainer -containerID $arguments[1]
            }
            "stop" {
                if ($arguments.Length -lt 2) {
                    Write-Host "Error: Container ID required" -ForegroundColor Red
                    return
                }
                Stop-DockerContainer -containerID $arguments[1]
            }
            "logs" {
                if ($arguments.Length -lt 2) {
                    Write-Host "Error: Container ID required" -ForegroundColor Red
                    return
                }
                Get-DockerLogs -containerID $arguments[1] -follow:($arguments -contains "--follow")
            }
            "build" {
                if ($arguments.Length -lt 3) {
                    Write-Host "Error: Path and tag required" -ForegroundColor Red
                    return
                }
                Build-DockerImage -path $arguments[1] -tag $arguments[3]
            }
            "run" {
                if ($arguments.Length -lt 2) {
                    Write-Host "Error: Image name required" -ForegroundColor Red
                    return
                }
                New-DockerContainer -image $arguments[1]
            }
            "help" {
                Show-DockerHelp
            }
            default {
                Write-Host "Unknown Docker command. Use 'smartcli docker help' for usage." -ForegroundColor Yellow
            }
        }
    }
    catch {
        Write-Log "Error processing Docker command: $_" -Level Error
        Write-Host "Error: Failed to process Docker command" -ForegroundColor Red
    }
}

# Export functions
Export-ModuleMember -Function Process-DockerCommand, Show-DockerHelp
