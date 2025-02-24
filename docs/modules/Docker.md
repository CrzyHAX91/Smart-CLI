# Docker Module Documentation

The Docker module provides PowerShell functions for managing Docker containers and images through SmartCLI.

## Prerequisites

- Docker Desktop or Docker Engine installed and running
- SmartCLI properly installed

## Commands

### List Containers
```powershell
# List running containers
smartcli docker containers

# List all containers (including stopped)
smartcli docker containers -All

# List only container IDs
smartcli docker containers -Quiet
```

### List Images
```powershell
# List images
smartcli docker images

# List all images
smartcli docker images -All

# List only image IDs
smartcli docker images -Quiet
```

### Container Management
```powershell
# Start a container
smartcli docker start <container-name>

# Stop a container
smartcli docker stop <container-name>

# Stop a container with custom timeout
smartcli docker stop <container-name> -Timeout 30
```

### Container Logs
```powershell
# View container logs
smartcli docker logs <container-name>

# Follow container logs
smartcli docker logs <container-name> -Follow

# View last N lines of logs
smartcli docker logs <container-name> -Tail -Lines 50
```

## Examples

### Basic Container Management
```powershell
# Start a Nginx container
smartcli docker start nginx-container

# View its logs
smartcli docker logs nginx-container -Follow

# Stop the container after use
smartcli docker stop nginx-container
```

### Container Inspection
```powershell
# List all containers including stopped ones
smartcli docker containers -All

# Get logs from the last 100 lines
smartcli docker logs my-container -Tail -Lines 100
```

## Error Handling

The module includes comprehensive error handling:
- Checks for Docker installation
- Validates container existence
- Reports detailed error messages
- Handles timeouts gracefully

## Function Reference

### Get-DockerContainers
Lists Docker containers.

Parameters:
- `-All`: Include stopped containers
- `-Quiet`: Show only container IDs

### Get-DockerImages
Lists Docker images.

Parameters:
- `-All`: Include intermediate images
- `-Quiet`: Show only image IDs

### Start-DockerContainer
Starts a Docker container.

Parameters:
- `-ContainerName`: Name or ID of the container (Required)

### Stop-DockerContainer
Stops a Docker container.

Parameters:
- `-ContainerName`: Name or ID of the container (Required)
- `-Timeout`: Seconds to wait before forcing stop (Default: 10)

### Get-DockerLogs
Retrieves container logs.

Parameters:
- `-ContainerName`: Name or ID of the container (Required)
- `-Follow`: Follow log output
- `-Tail`: Show only last N lines
- `-Lines`: Number of lines to show (Default: 100)

## Testing

The module includes comprehensive tests in `tests/Docker/Docker.Tests.ps1`. Run tests using:

```powershell
Invoke-Pester ./tests/Docker/Docker.Tests.ps1
```

## Troubleshooting

### Common Issues

1. Docker not running
```
Error: Docker is not installed or not running
Solution: Start Docker Desktop or Docker Engine
```

2. Container not found
```
Error: Failed to start container
Solution: Verify container name and existence
```

3. Permission issues
```
Error: Permission denied
Solution: Run SmartCLI with appropriate permissions
```

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines on contributing to this module.

## License

This module is part of SmartCLI and is licensed under the MIT License. See [LICENSE](../../LICENSE) for details.
