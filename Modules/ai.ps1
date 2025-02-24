function Get-AISuggestion($input) {
    $commands = @("docker", "k8s", "ssh", "task", "git", "ls", "cd", "mkdir", "rm", "copy")
    
    $bestMatch = ""
    $minDistance = 999
    
    foreach ($cmd in $commands) {
        $distance = ($cmd -clike $input) ? 0 : 1
        if ($distance -lt $minDistance) {
            $minDistance = $distance
            $bestMatch = $cmd
        }
    }

    return $bestMatch
}
