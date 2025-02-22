#!/usr/bin/env node
import { Command } from 'commander';
import { askQuestion } from '../commands/ask.js';
import { historyCommand, clearHistory } from '../commands/history.js';
import { generateK8sConfig, handleDocker, analyzeInfrastructure } from '../commands/devops.js';
import { configureAPI } from '../utils/config.js';
import figlet from 'figlet';
import chalk from 'chalk';
import boxen from 'boxen';

const NEON_COLORS = ['#FF1B8D', '#00FF9F', '#00F3FF', '#FF3C00', '#FF00FF'];

function rainbow(str) {
  return str.split('').map((char, i) => {
    const color = NEON_COLORS[i % NEON_COLORS.length];
    return chalk.hex(color)(char);
  }).join('');
}

// Display startup banner
console.log('\n' + rainbow(figlet.textSync('Smart AI CLI', { font: 'ANSI Shadow' })));
console.log(boxen(
  chalk.cyan('AI-Powered CLI with DevOps Optimization'),
  {
    padding: 1,
    margin: 1,
    borderStyle: 'double',
    borderColor: 'cyan'
  }
));

const program = new Command();

program
  .name('smart-ai')
  .description('Advanced AI-powered CLI tool with DevOps capabilities')
  .version('1.2.0');

// AI Commands
program
  .command('ask <question>')
  .description('Ask a question and get an AI-powered response')
  .option('-q, --quick', 'Get a quick response using cache when available')
  .option('-d, --detailed', 'Get a detailed response with comprehensive analysis')
  .option('-s, --save <filename>', 'Save the response to a file')
  .action(askQuestion);

// History Commands
program
  .command('history')
  .description('View and manage command history')
  .option('-s, --search <query>', 'Search through history')
  .option('-i, --interactive', 'Browse history interactively with AI-powered insights')
  .option('-l, --limit <number>', 'Limit the number of entries shown', parseInt)
  .action(historyCommand);

program
  .command('clear-history')
  .description('Clear command history')
  .action(clearHistory);

// Kubernetes Commands
program
  .command('k8s-generate')
  .description('Generate Kubernetes configuration with AI optimization')
  .requiredOption('-n, --name <name>', 'Application name')
  .requiredOption('-i, --image <image>', 'Container image')
  .option('-r, --replicas <number>', 'Number of replicas', parseInt, 1)
  .option('-t, --service-type <type>', 'Service type (ClusterIP, NodePort, LoadBalancer)', 'ClusterIP')
  .action(generateK8sConfig);

// Docker Commands
program
  .command('docker')
  .description('Docker operations with AI-powered optimization')
  .option('-b, --build', 'Build Docker image')
  .option('-r, --run', 'Run Docker container')
  .option('-t, --tag <tag>', 'Image tag')
  .option('-i, --image <image>', 'Image name')
  .option('-n, --name <name>', 'Container name')
  .option('-p, --ports <ports...>', 'Port mappings')
  .option('-e, --env <env...>', 'Environment variables')
  .option('-v, --volumes <volumes...>', 'Volume mappings')
  .option('--network <network>', 'Network name')
  .action(handleDocker);

// Infrastructure Analysis
program
  .command('analyze')
  .description('Analyze infrastructure configurations with AI suggestions')
  .option('-k, --kubernetes', 'Analyze Kubernetes configurations')
  .option('-d, --docker', 'Analyze Dockerfile')
  .option('-p, --path <path>', 'Path to configuration files')
  .action(analyzeInfrastructure);

// Configuration
program
  .command('configure')
  .description('Configure API keys and settings')
  .option('-r, --reset', 'Reset configuration to defaults')
  .option('-t, --test', 'Test API configuration')
  .action(configureAPI);

// Add examples
program.on('--help', () => {
  console.log(boxen(
    `${chalk.cyan('Examples:')}\n\n` +
    chalk.white(
      `  # Generate Kubernetes configuration
  $ smart-ai k8s-generate -n myapp -i nginx:latest -r 3

  # Build and run Docker container
  $ smart-ai docker -b -r -t myapp:latest -p 8080:80

  # Analyze infrastructure
  $ smart-ai analyze -k -d

  # Ask DevOps-related question
  $ smart-ai ask "How to optimize Kubernetes resource usage?"

  # View command history
  $ smart-ai history --interactive`
    ),
    {
      title: rainbow('🚀 Quick Start'),
      titleAlignment: 'center',
      padding: 1,
      margin: 1,
      borderStyle: 'double',
      borderColor: 'cyan'
    }
  ));
});

// Error handling
program.showHelpAfterError(chalk.yellow('(add --help for additional information)'));

// Parse command line arguments
program.parse();

// Show help if no arguments provided
if (!process.argv.slice(2).length) {
  program.outputHelp((help) => {
    return boxen(help, {
      title: rainbow('🌟 Smart AI CLI Help'),
      titleAlignment: 'center',
      padding: 1,
      margin: 1,
      borderStyle: 'double',
      borderColor: 'cyan'
    });
  });
}

// Handle unhandled rejections
process.on('unhandledRejection', (error) => {
  console.error(boxen(
    chalk.red(`Fatal Error: ${error.message}\n\n${error.stack}`),
    {
      title: rainbow('💥 Unhandled Error'),
      titleAlignment: 'center',
      padding: 1,
      margin: 1,
      borderStyle: 'double',
      borderColor: 'red'
    }
  ));
  process.exit(1);
});
