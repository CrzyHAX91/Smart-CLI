# Smart-CLI: Advanced AI-Powered Command Line Interface

## 🚀 Overview

Smart-CLI is a powerful, modern command-line interface tool that combines multiple AI services (OpenAI, Llama, and Serper) to provide intelligent responses and search capabilities. It features both a CLI tool and a web interface, making it versatile for different use cases.

## ⚠️ Security Notice

**IMPORTANT**: This project requires API keys for various services. Never commit your actual API keys to the repository. Always use environment variables and keep your `.env` file in `.gitignore`.

## ✨ Features

### CLI Features
- 🤖 Multiple AI Model Support (OpenAI, Llama)
- 🔍 Integrated Web Search via Serper
- 📝 Command History Management
- 🛠️ DevOps Tools Integration
- 💾 Local Caching for Quick Responses

### Web Interface Features
- 🎨 Modern, Aggressive Styling
- 📱 Responsive Design
- 🔄 Real-time AI Model Switching
- 💡 Interactive Search Results
- 📊 Search History Tracking

## 🛠️ Installation

### Prerequisites
- Node.js >= 16.0.0
- npm or yarn
- Git

### CLI Installation
```bash
# Clone the repository
git clone https://github.com/CrzyHAX91/Smart-CLI.git

# Navigate to CLI directory
cd Smart-CLI/ai-cli-tool

# Install dependencies
npm install

# Link the CLI globally
npm link
```

### Web Interface Installation
```bash
# Navigate to web directory
cd Smart-CLI/ai-cli-web

# Install dependencies
npm install

# Start development server
npm start
```

## 🔧 Configuration

1. Create a `.env` file in both `ai-cli-tool` and `ai-cli-web` directories
2. Add your API keys and configurations:

```env
# AI Service API Keys (Replace with your actual keys)
SERPER_API_KEY=YOUR_SERPER_API_KEY
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
REPLICATE_API_TOKEN=YOUR_REPLICATE_TOKEN

# Model Configurations
OPENAI_MODEL=Meta-Llama/llama-3.3370B-instruct-turbo
OPENAI_API_BASE_URL=https://api.openai.com/v1
```

3. Ensure `.env` is listed in `.gitignore`
4. Never share or expose your API keys

## 📚 Usage

### CLI Commands

1. **Ask Questions**
```bash
smart-ai ask "What is the capital of France?"
smart-ai ask --detailed "Explain quantum computing"
smart-ai ask --quick "Current weather in London"
```

2. **History Management**
```bash
smart-ai history
smart-ai history --search "quantum"
smart-ai history --interactive
smart-ai clear-history
```

3. **DevOps Tools**
```bash
smart-ai k8s-generate -n myapp -i nginx:latest
smart-ai docker -b -r -t myapp:latest
smart-ai analyze -k -d
```

### Web Interface

1. Open `http://localhost:3000` in your browser
2. Use the model selector to choose between AI services
3. Enter your query in the search box
4. View results from multiple sources simultaneously
5. Access your search history below the results

## 🎨 Styling

The web interface features a modern, aggressive design with:
- Neon color scheme
- Smooth animations
- Interactive elements
- Responsive layout
- Dark mode optimization

## 🔐 Security Best Practices

1. Never commit `.env` files to version control
2. Use environment variables for sensitive data
3. Regularly rotate API keys
4. Monitor API usage and set rate limits
5. Implement proper error handling for API failures

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔧 Troubleshooting

### Common Issues

1. **API Key Issues**
   - Ensure all API keys are correctly set in `.env`
   - Verify API key permissions and quotas
   - Check for API key expiration

2. **Installation Problems**
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall

3. **Web Interface Issues**
   - Check browser console for errors
   - Verify correct port availability

## 📞 Support

For support, please:
1. Check the [issues](https://github.com/CrzyHAX91/Smart-CLI/issues) page
2. Create a new issue if needed
3. Join our community discussions

## 🙏 Acknowledgments

- OpenAI for their powerful API
- Llama for their AI model
- Serper for search capabilities
- The open-source community

---

Made with ❤️ by CrzyHAX91
