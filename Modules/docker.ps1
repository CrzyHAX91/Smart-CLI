# docker.ps1 - Beheer Docker-containers
Write-Host "Docker CLI geladen..."

function List-DockerContainers {
    docker ps -a
}

function Start-DockerContainer($containerID) {
    docker start $containerID
    Write-Host "Container $containerID gestart"
}

function Stop-DockerContainer($containerID) {
    docker stop $containerID
    Write-Host "Container $containerID gestopt"
}
