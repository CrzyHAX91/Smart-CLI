import { execSync } from 'child_process';
import which from 'which';
import chalk from 'chalk';
import boxen from 'boxen';
import os from 'os';

async function checkEnvironment() {
  console.log(chalk.cyan('Checking environment requirements...'));

  try {
    // Check Node.js version
    const nodeVersion = process.version;
    const requiredVersion = '>=18.0.0';
    
    if (!satisfiesVersion(nodeVersion, requiredVersion)) {
      throw new Error(`Node.js ${requiredVersion} is required. Current version: ${nodeVersion}`);
    }
    console.log(chalk.green(`✓ Node.js version: ${nodeVersion}`));

    // Check for required system tools
    const requiredTools = [
      { name: 'git', command: 'git --version' },
      { name: 'npm', command: 'npm --version' },
      { name: 'node', command: 'node --version' }
    ];

    for (const tool of requiredTools) {
      try {
        const path = await which(tool.name);
        const version = execSync(tool.command).toString().trim();
        console.log(chalk.green(`✓ ${tool.name} found: ${version} (${path})`));
      } catch {
        throw new Error(`${tool.name} is not installed or not in PATH`);
      }
    }

    // Check system memory
    const totalMemory = Math.round(os.totalmem() / (1024 * 1024));
    const minMemory = 64;
    if (totalMemory < minMemory) {
      throw new Error(`Minimum ${minMemory}MB of memory required`);
    }
    console.log(chalk.green(`✓ System memory: ${totalMemory}MB total available`));

    // Check operating system compatibility
    const platform = process.platform;
    const supportedPlatforms = ['win32', 'linux', 'darwin'];
    
    if (!supportedPlatforms.includes(platform)) {
      throw new Error(`Unsupported operating system: ${platform}`);
    }
    console.log(chalk.green(`✓ Operating system: ${getPlatformName(platform)}`));

    // Check for optional dependencies
    const optionalTools = [
      { name: 'docker', command: 'docker --version' },
      { name: 'kubectl', command: 'kubectl version --client' }
    ];

    for (const tool of optionalTools) {
      try {
        const version = execSync(tool.command).toString().trim();
        console.log(chalk.green(`✓ ${tool.name} found: ${version}`));
      } catch {
        console.log(chalk.yellow(`! ${tool.name} not found (optional)`));
      }
    }

    console.log(boxen(
      chalk.green('Environment check passed successfully!'),
      {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'green'
      }
    ));

  } catch (error) {
    console.error(boxen(
      chalk.red(`Environment check failed:\n${error.message}`),
      {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'red'
      }
    ));
    process.exit(1);
  }
}

function satisfiesVersion(current, required) {
  const currentNum = parseInt(current.slice(1).split('.')[0]);
  const requiredNum = parseInt(required.slice(2).split('.')[0]);
  return currentNum >= requiredNum;
}

function getPlatformName(platform) {
  const names = {
    win32: 'Windows',
    linux: 'Linux',
    darwin: 'macOS'
  };
  return names[platform] || platform;
}

checkEnvironment();
