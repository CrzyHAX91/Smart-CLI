<div align="center">

# 🚀 Smart AI CLI

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/smart-ai-cli.svg)](https://badge.fury.io/js/smart-ai-cli)
[![CI/CD](https://github.com/yourusername/smart-ai-cli/actions/workflows/main.yml/badge.svg)](https://github.com/yourusername/smart-ai-cli/actions)

A powerful command-line interface that combines OpenAI, Llama, and Serper for intelligent responses with an aggressive neon aesthetic.

![Smart AI CLI Demo](docs/images/demo.gif)

</div>

## ✨ Features

- 🧠 **Triple AI Integration**: OpenAI + Llama + Serper
- 🎨 **Aggressive Neon Styling**: Beautiful CLI interface
- 💡 **Smart Suggestions**: AI-powered query enhancement
- 🔍 **Intelligent Search**: Context-aware results
- 📚 **Advanced History**: AI-categorized with insights
- ⚡ **High Performance**: Parallel processing & caching
- 🛠️ **Configurable**: Easy API key management

## 🚀 Quick Start

### Installation

```bash
# Using npm
npm install -g smart-ai-cli

# Or using the Windows installer
./install.bat
```

### Download Scripts

You can also download and install the Smart AI CLI using the provided scripts:

- **For Linux/MacOS**:
  ```bash
  curl -O https://raw.githubusercontent.com/yourusername/smart-ai-cli/main/download.sh
  chmod +x download.sh
  ./download.sh
  ```

- **For Windows (PowerShell)**:
  ```powershell
  Invoke-WebRequest -Uri https://raw.githubusercontent.com/yourusername/smart-ai-cli/main/download.ps1 -OutFile download.ps1
  .\download.ps1
  ```

### Basic Usage

```bash
# Ask a question
smart-ai ask "What is quantum computing?"

# Get a detailed response
smart-ai ask --detailed "Explain blockchain technology"

# Browse history with AI insights
smart-ai history --interactive
```

## 🎯 Examples

### Smart Question Enhancement
```bash
$ smart-ai ask "what is ai"
✨ Enhanced: "Explain the fundamental concepts of Artificial Intelligence, its current applications, and future implications"
```

### Interactive History with AI Categories
```bash
$ smart-ai history --interactive
🔮 Categories detected:
- Technology Concepts
- Scientific Theories
- Programming
- Future Trends
```

### Detailed Analysis
```bash
$ smart-ai ask --detailed "blockchain"
🧠 Multi-model analysis:
- Technical Overview (OpenAI)
- Real-world Applications (Llama)
- Latest Developments (Serper)
```

## 🛠️ Configuration

```bash
# Configure API keys
smart-ai configure

# Test configuration
smart-ai configure --test

# Reset to defaults
smart-ai configure --reset
```

## 🎨 Customization

### Environment Variables
```bash
OPENAI_API_KEY=your_key_here
LLAMA_API_KEY=your_key_here
SERPER_API_KEY=your_key_here
```

### Configuration File
```json
{
  "theme": "neon",
  "cacheEnabled": true,
  "defaultMode": "balanced"
}
```

## 🔧 Development

### Prerequisites
- Node.js >= 18
- npm >= 7

### Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/smart-ai-cli.git

# Install dependencies
cd smart-ai-cli
npm install

# Run in development mode
npm run dev
```

### Building
```bash
# Create executable
npm run build

# Create installer
npm run package
```

### Testing
```bash
# Run tests
npm test

# Run linter
npm run lint
```

## 📚 Documentation

Detailed documentation is available in the [docs](docs) directory:
- [API Reference](docs/API.md)
- [Configuration Guide](docs/CONFIGURATION.md)
- [Contributing Guide](docs/CONTRIBUTING.md)
- [Architecture Overview](docs/ARCHITECTURE.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for their powerful API
- Llama for advanced AI processing
- Serper for web search capabilities
- The open-source community

## 🔮 Roadmap

- [ ] Voice input support
- [ ] Custom AI model integration
- [ ] Plugin system
- [ ] Cloud sync for history
- [ ] Team collaboration features

## 📊 Stats

![GitHub Stars](https://img.shields.io/github/stars/yourusername/smart-ai-cli?style=social)
![GitHub Forks](https://img.shields.io/github/forks/yourusername/smart-ai-cli?style=social)
![GitHub Issues](https://img.shields.io/github/issues/yourusername/smart-ai-cli)
![GitHub PRs](https://img.shields.io/github/issues-pr/yourusername/smart-ai-cli)

---

<div align="center">
Made with ❤️ by the Smart AI CLI team
</div>
