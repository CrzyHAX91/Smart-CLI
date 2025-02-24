# ssh.ps1 - Externe SSH-sessies beheren
Write-Host "SSH-module geladen..."

function Connect-SSH($host, $user) {
    ssh "$user@$host"
}
