@{
    # Module manifest for Docker module
    
    # Module version
    ModuleVersion = '1.0.0'
    
    # Unique identifier for this module
    GUID = '12345678-1234-5678-1234-567812345678'
    
    # Author of this module
    Author = 'SmartCLI Contributors'
    
    # Company or vendor of this module
    CompanyName = 'SmartCLI'
    
    # Copyright statement for this module
    Copyright = '(c) 2024 SmartCLI. All rights reserved.'
    
    # Description of the functionality provided by this module
    Description = 'Docker management module for SmartCLI'
    
    # Minimum version of the PowerShell engine required by this module
    PowerShellVersion = '5.1'
    
    # Name of the PowerShell host required by this module
    PowerShellHostName = ''
    
    # Minimum version of the PowerShell host required by this module
    PowerShellHostVersion = ''
    
    # Modules that must be imported into the global environment prior to importing this module
    RequiredModules = @('Core')
    
    # Script files (.ps1) that are run in the caller's environment prior to importing this module
    ScriptsToProcess = @()
    
    # Type files (.ps1xml) to be loaded when importing this module
    TypesToProcess = @()
    
    # Format files (.ps1xml) to be loaded when importing this module
    FormatsToProcess = @()
    
    # Functions to export from this module
    FunctionsToExport = @(
        'Get-DockerContainers',
        'Get-DockerImages',
        'Start-DockerContainer',
        'Stop-DockerContainer',
        'Get-DockerLogs'
    )
    
    # Cmdlets to export from this module
    CmdletsToExport = @()
    
    # Variables to export from this module
    VariablesToExport = @()
    
    # Aliases to export from this module
    AliasesToExport = @()
    
    # List of all modules packaged with this module
    ModuleList = @()
    
    # List of all files packaged with this module
    FileList = @(
        'Docker.psd1',
        'Docker.ps1'
    )
    
    # Private data to pass to the module specified in RootModule/ModuleToProcess
    PrivateData = @{
        PSData = @{
            # Tags applied to this module for module discovery
            Tags = @('Docker', 'Container', 'DevOps', 'SmartCLI')
            
            # A URL to the license for this module
            LicenseUri = 'https://github.com/yourusername/SmartCLI/blob/main/LICENSE'
            
            # A URL to the main website for this project
            ProjectUri = 'https://github.com/yourusername/SmartCLI'
            
            # ReleaseNotes of this module
            ReleaseNotes = @'
1.0.0
- Initial release
- Basic Docker container and image management
- Container logs viewing
'@
        }
    }
}
