# tasks.ps1 - Automatische taken beheren
Write-Host "Takenbeheer geladen..."

function Schedule-Task($command, $interval) {
    $action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "$command"
    $trigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes($interval)
    Register-ScheduledTask -TaskName "SmartCLI-$command" -Action $action -Trigger $trigger
}
