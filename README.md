# SmartCLI

A powerful, modern CLI toolkit for developers combining PowerShell automation, AI assistance, and web interfaces.

## Features

### Core CLI Features
- 🐳 Docker container and image management
- 🚀 Kubernetes cluster operations
- 🔑 SSH connection management
- ⚡ Task automation and scheduling
- 🤖 AI-powered command suggestions
- 📝 Comprehensive logging
- 🎨 Modern, colorful interface

### AI CLI Tool
- Smart query enhancement using OpenAI
- Contextual suggestions using Llama
- Search integration with Serper
- Caching for faster responses
- Beautiful CLI interface with neon colors

### Web Interface
- Modern React-based dashboard
- Real-time command execution
- History visualization
- Interactive search

### API Service
- RESTful Flask backend
- Request logging and monitoring
- Error handling and validation
- Secure API endpoints

## Installation

1. Clone this repository:
\`\`\`powershell
git clone https://github.com/yourusername/SmartCLI.git
cd SmartCLI
\`\`\`

2. Run the installation script:
\`\`\`powershell
.\Modules\install_smartcli.ps1
\`\`\`

3. Verify the installation:
\`\`\`powershell
smartcli --version
\`\`\`

## Usage

### PowerShell CLI

Docker Operations:
\`\`\`powershell
# List containers
smartcli docker ps

# Start/stop containers
smartcli docker start <container-id>
smartcli docker stop <container-id>

# View logs
smartcli docker logs <container-id>
\`\`\`

Kubernetes Operations:
\`\`\`powershell
# Get resources
smartcli k8s get pods
smartcli k8s get services

# Describe resources
smartcli k8s describe pod <pod-name>

# View logs
smartcli k8s logs <pod-name>
\`\`\`

SSH Management:
\`\`\`powershell
# List connections
smartcli ssh list

# Add connection
smartcli ssh add -name dev-server -host example.com -user admin

# Connect
smartcli ssh connect dev-server
\`\`\`

Task Automation:
\`\`\`powershell
# List tasks
smartcli task list

# Create task
smartcli task create -name backup -desc "Backup files" -cmd "xcopy /s /e /i src dest"

# Run task
smartcli task run backup

# View history
smartcli task history
\`\`\`

### AI CLI Tool

\`\`\`bash
# Ask questions
smart-ai ask "What is Docker?"

# Get quick responses
smart-ai ask "Explain Kubernetes" --quick

# Save output
smart-ai ask "What is CI/CD?" --save output.txt
\`\`\`

### Web Interface

1. Start the development server:
\`\`\`bash
cd user-workspace/ai-cli-web
npm install
npm start
\`\`\`

2. Open http://localhost:3000 in your browser

### API Service

1. Start the Flask server:
\`\`\`bash
cd user-workspace/flask-api-service
pip install -r requirements.txt
python app.py
\`\`\`

2. API will be available at http://localhost:5000

## Configuration

### PowerShell CLI
- Configuration files are stored in \`~/.smartcli/\`
- Logs are stored in \`~/.smartcli/logs/\`
- SSH connections in \`~/.smartcli/ssh/connections.json\`
- Tasks in \`~/.smartcli/tasks/tasks.json\`

### AI CLI Tool
Configure API keys:
\`\`\`bash
smart-ai configure
\`\`\`

Or set environment variables:
- \`OPENAI_API_KEY\`
- \`LLAMA_API_KEY\`
- \`SERPER_API_KEY\`

## Development

### Project Structure
\`\`\`
SmartCLI/
├── Modules/                 # PowerShell modules
│   ├── smartcli.ps1        # Main CLI entry point
│   ├── ai.ps1              # AI suggestions
│   ├── docker.ps1          # Docker operations
│   ├── k8s.ps1             # Kubernetes operations
│   ├── ssh.ps1             # SSH management
│   └── tasks.ps1           # Task automation
├── user-workspace/
│   ├── ai-cli-tool/        # Node.js AI CLI tool
│   ├── ai-cli-web/         # React web interface
│   └── flask-api-service/  # Flask API backend
└── docs/                   # Documentation
\`\`\`

### Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:
- Code style
- Pull requests
- Testing
- Documentation

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Security

For security concerns, please see our [SECURITY.md](SECURITY.md) file.

## Roadmap

See [ROADMAP.md](ROADMAP.md) for planned features and improvements.
