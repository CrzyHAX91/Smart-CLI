# Kubernetes Module - Cluster and Resource Management
# Version: 1.0.0

# Verify kubectl installation
function Test-KubernetesInstallation {
    try {
        $kubectlVersion = kubectl version --client --output=json | ConvertFrom-Json
        $version = $kubectlVersion.clientVersion.gitVersion
        Write-Log "kubectl version $version detected" -Level Info
        return $true
    }
    catch {
        Write-Log "kubectl is not installed: $_" -Level Error
        Write-Host "`nError: kubectl is not installed." -ForegroundColor Red
        Write-Host "Please install kubectl to use Kubernetes features.`n" -ForegroundColor Yellow
        return $false
    }
}

# Check cluster connection
function Test-ClusterConnection {
    try {
        $context = kubectl config current-context
        Write-Log "Connected to cluster context: $context" -Level Info
        return $true
    }
    catch {
        Write-Log "Not connected to any Kubernetes cluster: $_" -Level Error
        Write-Host "`nError: Not connected to any Kubernetes cluster." -ForegroundColor Red
        Write-Host "Use 'kubectl config use-context' to select a cluster.`n" -ForegroundColor Yellow
        return $false
    }
}

# Get resources with formatted output
function Get-KubernetesResources {
    param(
        [Parameter(Mandatory=$true)]
        [string]$resource,
        [string]$namespace = "default",
        [string]$selector,
        [switch]$allNamespaces,
        [switch]$wide
    )
    
    try {
        $command = "kubectl get $resource"
        
        if ($allNamespaces) {
            $command += " --all-namespaces"
        }
        elseif ($namespace) {
            $command += " -n $namespace"
        }
        
        if ($selector) {
            $command += " -l $selector"
        }
        
        if ($wide) {
            $command += " -o wide"
        }
        
        Write-Log "Getting Kubernetes resources: $command" -Level Info
        Invoke-Expression $command
    }
    catch {
        Write-Log "Error getting $resource resources: $_" -Level Error
        Write-Host "Error: Failed to get $resource resources" -ForegroundColor Red
    }
}

# Describe resource
function Get-KubernetesResourceDescription {
    param(
        [Parameter(Mandatory=$true)]
        [string]$resource,
        [Parameter(Mandatory=$true)]
        [string]$name,
        [string]$namespace = "default"
    )
    
    try {
        Write-Log "Describing $resource/$name in namespace $namespace" -Level Info
        kubectl describe $resource $name -n $namespace
    }
    catch {
        Write-Log "Error describing $resource/$name: $_" -Level Error
        Write-Host "Error: Failed to describe $resource/$name" -ForegroundColor Red
    }
}

# Get pod logs
function Get-PodLogs {
    param(
        [Parameter(Mandatory=$true)]
        [string]$podName,
        [string]$namespace = "default",
        [string]$container,
        [switch]$follow,
        [int]$tail = 100
    )
    
    try {
        $command = "kubectl logs $podName"
        
        if ($namespace) {
            $command += " -n $namespace"
        }
        
        if ($container) {
            $command += " -c $container"
        }
        
        if ($follow) {
            $command += " -f"
        }
        
        $command += " --tail=$tail"
        
        Write-Log "Getting logs for pod $podName" -Level Info
        Invoke-Expression $command
    }
    catch {
        Write-Log "Error getting logs for pod $podName: $_" -Level Error
        Write-Host "Error: Failed to get logs for pod $podName" -ForegroundColor Red
    }
}

# Apply manifest
function Apply-KubernetesManifest {
    param(
        [Parameter(Mandatory=$true)]
        [string]$path
    )
    
    try {
        Write-Log "Applying manifest from $path" -Level Info
        kubectl apply -f $path
        Write-Host "Manifest applied successfully" -ForegroundColor Green
    }
    catch {
        Write-Log "Error applying manifest $path: $_" -Level Error
        Write-Host "Error: Failed to apply manifest" -ForegroundColor Red
    }
}

# Delete resource
function Remove-KubernetesResource {
    param(
        [Parameter(Mandatory=$true)]
        [string]$resource,
        [Parameter(Mandatory=$true)]
        [string]$name,
        [string]$namespace = "default",
        [switch]$force
    )
    
    try {
        $command = "kubectl delete $resource $name"
        
        if ($namespace) {
            $command += " -n $namespace"
        }
        
        if ($force) {
            $command += " --force --grace-period=0"
        }
        
        Write-Log "Deleting $resource/$name" -Level Info
        Invoke-Expression $command
        Write-Host "$resource/$name deleted successfully" -ForegroundColor Green
    }
    catch {
        Write-Log "Error deleting $resource/$name: $_" -Level Error
        Write-Host "Error: Failed to delete $resource/$name" -ForegroundColor Red
    }
}

# Show Kubernetes command help
function Show-KubernetesHelp {
    $help = @"
Kubernetes Commands:
    get <resource>         List resources
    describe <resource>    Show detailed resource information
    logs <pod>            View pod logs
    apply -f <file>       Apply a manifest file
    delete <resource>     Delete a resource

Common Resources:
    pods (po)
    services (svc)
    deployments (deploy)
    nodes (no)
    namespaces (ns)

Options:
    -n, --namespace       Specify namespace
    -A, --all-namespaces Show resources across all namespaces
    -o wide              Show additional information
    -l, --selector       Filter by label

Examples:
    smartcli k8s get pods
    smartcli k8s get pods -n kube-system
    smartcli k8s describe pod my-pod
    smartcli k8s logs my-pod -f
    smartcli k8s apply -f manifest.yaml
    smartcli k8s delete pod my-pod
"@
    
    Write-Host $help -ForegroundColor Cyan
}

# Process Kubernetes commands
function Process-KubernetesCommand {
    param(
        [string[]]$arguments
    )
    
    if (-not (Test-KubernetesInstallation)) {
        return
    }
    
    if (-not (Test-ClusterConnection)) {
        return
    }
    
    try {
        switch ($arguments[0]) {
            "get" {
                if ($arguments.Length -lt 2) {
                    Write-Host "Error: Resource type required" -ForegroundColor Red
                    return
                }
                Get-KubernetesResources -resource $arguments[1]
            }
            "describe" {
                if ($arguments.Length -lt 3) {
                    Write-Host "Error: Resource type and name required" -ForegroundColor Red
                    return
                }
                Get-KubernetesResourceDescription -resource $arguments[1] -name $arguments[2]
            }
            "logs" {
                if ($arguments.Length -lt 2) {
                    Write-Host "Error: Pod name required" -ForegroundColor Red
                    return
                }
                Get-PodLogs -podName $arguments[1] -follow:($arguments -contains "-f")
            }
            "apply" {
                if ($arguments.Length -lt 3 -or $arguments[1] -ne "-f") {
                    Write-Host "Error: Manifest file path required (-f flag)" -ForegroundColor Red
                    return
                }
                Apply-KubernetesManifest -path $arguments[2]
            }
            "delete" {
                if ($arguments.Length -lt 3) {
                    Write-Host "Error: Resource type and name required" -ForegroundColor Red
                    return
                }
                Remove-KubernetesResource -resource $arguments[1] -name $arguments[2]
            }
            "help" {
                Show-KubernetesHelp
            }
            default {
                Write-Host "Unknown Kubernetes command. Use 'smartcli k8s help' for usage." -ForegroundColor Yellow
            }
        }
    }
    catch {
        Write-Log "Error processing Kubernetes command: $_" -Level Error
        Write-Host "Error: Failed to process Kubernetes command" -ForegroundColor Red
    }
}

# Export functions
Export-ModuleMember -Function Process-KubernetesCommand, Show-KubernetesHelp
