# Tests for Docker module
Describe "Docker Module Tests" {
    BeforeAll {
        # Import the module
        . (Join-Path $PSScriptRoot "../../Modules/Docker/docker.ps1")
    }

    Context "Docker Installation Check" {
        It "Should detect if Docker is installed" {
            $result = Test-DockerInstallation
            $result | Should -BeIn @($true, $false)
        }
    }

    Context "Container Operations" {
        It "Should list containers without error" {
            { Get-DockerContainers } | Should -Not -Throw
        }

        It "Should list all containers with -All switch" {
            { Get-DockerContainers -All } | Should -Not -Throw
        }

        It "Should list container IDs with -Quiet switch" {
            { Get-DockerContainers -Quiet } | Should -Not -Throw
        }
    }

    Context "Image Operations" {
        It "Should list images without error" {
            { Get-DockerImages } | Should -Not -Throw
        }

        It "Should list all images with -All switch" {
            { Get-DockerImages -All } | Should -Not -Throw
        }

        It "Should list image IDs with -Quiet switch" {
            { Get-DockerImages -Quiet } | Should -Not -Throw
        }
    }

    Context "Container Management" {
        BeforeAll {
            # Create a test container if Docker is available
            $dockerAvailable = Test-DockerInstallation
            if ($dockerAvailable) {
                docker run --name test-container -d nginx
                $testContainer = "test-container"
            }
        }

        It "Should start container if Docker is available" -Skip:(!$dockerAvailable) {
            $result = Start-DockerContainer -ContainerName $testContainer
            $result | Should -Be $true
        }

        It "Should stop container if Docker is available" -Skip:(!$dockerAvailable) {
            $result = Stop-DockerContainer -ContainerName $testContainer
            $result | Should -Be $true
        }

        It "Should get container logs if Docker is available" -Skip:(!$dockerAvailable) {
            { Get-DockerLogs -ContainerName $testContainer } | Should -Not -Throw
        }

        AfterAll {
            # Cleanup test container if Docker is available
            if ($dockerAvailable) {
                docker rm -f test-container
            }
        }
    }
}
