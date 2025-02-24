# k8s.ps1 - Beheer Kubernetes-clusters
Write-Host "Kubernetes CLI geladen..."

function List-K8sPods {
    kubectl get pods
}

function Describe-K8sPod($podName) {
    kubectl describe pod $podName
}

function Restart-K8sPod($podName) {
    kubectl delete pod $podName
    Write-Host "Pod $podName is herstart"
}
