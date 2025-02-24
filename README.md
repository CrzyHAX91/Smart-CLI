# SmartCLI

A powerful PowerShell-based CLI tool for automating common development tasks.

## Features

- 🐳 Docker management commands
- 🚀 Kubernetes (k8s) operations
- 🤖 AI-assisted development
- 🔑 SSH connection management
- ✅ Task automation

## Installation

1. Clone this repository:
```powershell
git clone https://github.com/yourusername/SmartCLI.git
cd SmartCLI
```

2. Run the installation script:
```powershell
.\Modules\install_smartcli.ps1
```

3. Verify the installation:
```powershell
smartcli --version
```

## Usage

```powershell
# Get help
smartcli --help

# Docker commands
smartcli docker ps
smartcli docker logs <container>

# Kubernetes commands
smartcli k8s get pods
smartcli k8s describe pod <pod-name>

# AI assistance
smartcli ai explain <command>
smartcli ai suggest <task>

# SSH management
smartcli ssh list
smartcli ssh connect <alias>

# Task automation
smartcli task list
smartcli task run <task-name>
```

## Module Documentation

- [Docker Module](./docs/docker.md)
- [Kubernetes Module](./docs/k8s.md)
- [AI Module](./docs/ai.md)
- [SSH Module](./docs/ssh.md)
- [Tasks Module](./docs/tasks.md)

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Security

For security concerns, please see our [SECURITY.md](SECURITY.md) file.
