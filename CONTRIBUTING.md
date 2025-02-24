# Contributing to SmartCLI

We love your input! We want to make contributing to SmartCLI as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code follows the style guidelines.
6. Issue that pull request!

## Pull Request Process

1. Update the README.md with details of changes to the interface, if applicable.
2. Update the version numbers in:
   - smartcli.ps1
   - install_smartcli.ps1
   - Any relevant documentation
3. The PR will be merged once you have the sign-off of at least one other developer.

## Any Contributions You Make Will Be Under the MIT Software License

In short, when you submit code changes, your submissions are understood to be under the same [MIT License](LICENSE) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report Bugs Using GitHub's [Issue Tracker](../../issues)

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](../../issues/new).

## Write Bug Reports With Detail, Background, and Sample Code

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can.
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Code Style Guidelines

- Use consistent indentation (4 spaces)
- Use descriptive variable names
- Comment your code where necessary
- Follow PowerShell best practices
- Keep functions focused and modular
- Write clear error messages

## Module Development Guidelines

When creating new modules:

1. Create a new .ps1 file in the Modules directory
2. Follow the module template structure
3. Include proper error handling
4. Add module documentation
5. Include module tests
6. Update module list in README.md

## Documentation

- Keep README.md up to date
- Document all functions and modules
- Include examples in documentation
- Update module-specific documentation

## Testing

- Write tests for new features
- Run existing tests before submitting PR
- Include both unit tests and integration tests
- Document test procedures

## License

By contributing, you agree that your contributions will be licensed under its MIT License.

## References

This document was adapted from the open-source contribution guidelines for [Facebook's Draft](https://github.com/facebook/draft-js/blob/master/CONTRIBUTING.md).
