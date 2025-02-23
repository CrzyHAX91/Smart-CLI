# Smart AI CLI Tool

A powerful command-line interface tool powered by AI that helps developers with various tasks.

## Features

- Smart query enhancement using OpenAI
- Contextual suggestions using Llama
- Search integration with Serper
- Caching for faster responses
- Error handling and graceful fallbacks
- Support for quick and detailed modes
- File output support
- Beautiful CLI interface with neon colors

## Installation

```bash
npm install -g smart-ai-cli
```

Or install from source:

```bash
git clone https://github.com/yourusername/smart-ai-cli.git
cd smart-ai-cli
npm install
npm link
```

## Configuration

Configure your API keys:

```bash
smart-ai configure
```

Or set environment variables:
- `OPENAI_API_KEY`
- `LLAMA_API_KEY`
- `SERPER_API_KEY`

## Usage

Basic query:
```bash
smart-ai ask "What is Docker?"
```

Quick mode (uses cache when available):
```bash
smart-ai ask "What is Kubernetes?" --quick
```

Detailed mode:
```bash
smart-ai ask "Explain microservices" --detailed
```

Save output to file:
```bash
smart-ai ask "What is CI/CD?" --save output.txt
```

## Development

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run tests:
   ```bash
   npm test
   ```

### Testing

The project uses Jest for testing. Tests are located in the `__tests__` directory.

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm test -- --watch
```

### Project Structure

```
ai-cli-tool/
├── commands/          # CLI commands
├── services/          # Core services
│   ├── llama.js      # Llama integration
│   ├── openai.js     # OpenAI integration
│   ├── serper.js     # Search integration
│   └── suggestions.js # Suggestions engine
├── utils/            # Utility functions
├── __tests__/        # Test files
└── scripts/          # Build scripts
```

### Recent Updates

- Added ES modules support
- Improved test coverage
- Enhanced error handling
- Added caching functionality
- Improved suggestions engine
- Added beautiful CLI interface with neon colors

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## License

MIT
