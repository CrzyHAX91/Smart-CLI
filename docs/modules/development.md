# SmartCLI Module Development Guide

This guide explains how to create new modules for SmartCLI, ensuring consistency and quality across all modules.

## Module Structure

```
Modules/
└── YourModule/
    ├── YourModule.ps1      # Main module code
    ├── YourModule.psd1     # Module manifest
    ├── YourModule.Format.ps1xml  # (Optional) Custom formatting
    └── private/            # Private functions
        └── helpers.ps1     # Helper functions
```

## Module Template

### 1. Module Script (YourModule.ps1)

```powershell
# Import core module
$CorePath = Join-Path $PSScriptRoot "../Core/core.ps1"
if (Test-Path $CorePath) {
    . $CorePath
}
else {
    throw "Core module not found. Please ensure SmartCLI is properly installed."
}

# Version information
$YOUR_MODULE_VERSION = "1.0.0"

# Module functions
function Get-YourModuleStatus {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Resource
    )
    
    try {
        # Your code here
    }
    catch {
        Write-SmartError "Operation failed" -ErrorRecord $_
    }
}

# Export functions
Export-ModuleMember -Function Get-YourModuleStatus
```

### 2. Module Manifest (YourModule.psd1)

```powershell
@{
    ModuleVersion = '1.0.0'
    GUID = '<Generate-New-GUID>'
    Author = 'Your Name'
    Description = 'Description of your module'
    PowerShellVersion = '5.1'
    RequiredModules = @('Core')
    FunctionsToExport = @('Get-YourModuleStatus')
}
```

## Best Practices

### 1. Error Handling

Always use try-catch blocks and the Core module's error handling:

```powershell
try {
    # Your code
}
catch {
    Write-SmartError "Descriptive error message" -ErrorRecord $_
}
```

### 2. Parameter Validation

Use parameter validation attributes:

```powershell
function Set-YourModuleConfig {
    param(
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]$Name,
        
        [Parameter(Mandatory = $true)]
        [ValidateRange(1, 100)]
        [int]$Value
    )
}
```

### 3. Documentation

Document your functions using comment-based help:

```powershell
<#
.SYNOPSIS
    Brief description of function
.DESCRIPTION
    Detailed description of function
.PARAMETER Name
    Description of parameter
.EXAMPLE
    Example usage
#>
```

### 4. Testing

Create tests for your module in `tests/YourModule/YourModule.Tests.ps1`:

```powershell
Describe "YourModule Tests" {
    BeforeAll {
        . (Join-Path $PSScriptRoot "../../Modules/YourModule/YourModule.ps1")
    }

    Context "Function Tests" {
        It "Should do something" {
            $result = Get-YourModuleStatus -Resource "test"
            $result | Should -Not -BeNullOrEmpty
        }
    }
}
```

## Module Documentation

Create documentation in `docs/modules/YourModule.md`:

```markdown
# YourModule Documentation

Description of your module's purpose and functionality.

## Commands

### Get-YourModuleStatus
Description and examples of usage.

## Examples

Practical examples of module usage.
```

## Development Workflow

1. **Plan Your Module**
   - Define clear purpose and functionality
   - Identify dependencies
   - Plan function names and parameters

2. **Create Structure**
   - Create module directory
   - Create required files
   - Set up test structure

3. **Implement Functions**
   - Write core functionality
   - Implement error handling
   - Add parameter validation

4. **Write Tests**
   - Unit tests for each function
   - Integration tests if needed
   - Test error conditions

5. **Create Documentation**
   - Write function documentation
   - Create module documentation
   - Add examples

6. **Review and Test**
   - Run all tests
   - Check code style
   - Verify documentation

## Code Style Guidelines

1. **Naming Conventions**
   - Use approved PowerShell verbs
   - PascalCase for functions
   - camelCase for variables

2. **Formatting**
   - Use 4 spaces for indentation
   - One blank line between functions
   - Align parameter blocks

3. **Comments**
   - Comment complex logic
   - Use comment-based help
   - Keep comments updated

## Module Integration

1. **Core Module Integration**
   - Import core module properly
   - Use core module functions
   - Handle dependencies

2. **Error Handling**
   - Use Write-SmartError
   - Provide detailed errors
   - Clean up on errors

3. **Configuration**
   - Use Get-SmartConfig
   - Handle missing configs
   - Validate settings

## Testing Requirements

1. **Unit Tests**
   - Test each function
   - Test error conditions
   - Mock dependencies

2. **Integration Tests**
   - Test with other modules
   - Test real-world scenarios
   - Test performance

## Submission Guidelines

1. **Code Review**
   - Follow style guide
   - Include all required files
   - Pass all tests

2. **Documentation**
   - Complete module docs
   - Update module index
   - Include examples

3. **Pull Request**
   - Clear description
   - Link related issues
   - Update CHANGELOG

## Support

For help with module development:
- Join our [Discord](https://discord.gg/smartcli)
- Check [FAQ](../FAQ.md)
- Create an issue

## Resources

- [PowerShell Best Practices](https://docs.microsoft.com/en-us/powershell/scripting/developer/module/module-guidance)
- [Pester Testing Framework](https://pester.dev)
- [SmartCLI Core Documentation](./Core.md)
