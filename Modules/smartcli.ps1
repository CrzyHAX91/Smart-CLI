# smartcli.ps1 - Windows CLI met moderne technologieën

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$modulesPath = "$scriptPath\modules"

# Laad AI-suggesties module
. "$modulesPath\ai.ps1"

param (
    [string]$command
)

if ($command -eq "docker") {
    . "$modulesPath\docker.ps1"
}
elseif ($command -eq "k8s") {
    . "$modulesPath\k8s.ps1"
}
elseif ($command -eq "ssh") {
    . "$modulesPath\ssh.ps1"
}
elseif ($command -eq "task") {
    . "$modulesPath\tasks.ps1"
}
else {
    $suggestion = Get-AISuggestion $command
    Write-Host "Onbekend commando: '$command'"
    Write-Host "Bedoelde je misschien: '$suggestion'?"
}
