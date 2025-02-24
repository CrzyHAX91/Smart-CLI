import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import dotenv from 'dotenv';
import boxen from 'boxen';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

async function validateConfig() {
  console.log(chalk.cyan('Validating configuration...'));

  try {
    // Check for required files
    const requiredFiles = [
      '.env',
      'package.json',
      'webpack.config.js',
      'src/index.js'
    ];

    for (const file of requiredFiles) {
      try {
        await fs.access(path.join(rootDir, file));
        console.log(chalk.green(`✓ ${file} exists`));
      } catch {
        throw new Error(`Missing required file: ${file}`);
      }
    }

    // Validate .env configuration
    const envPath = path.join(rootDir, '.env');
    const envConfig = dotenv.parse(await fs.readFile(envPath));

    const requiredEnvVars = [
      'OPENAI_API_KEY',
      'SERPER_API_KEY',
      'REPLICATE_API_TOKEN'
    ];

    const missingVars = requiredEnvVars.filter(v => !envConfig[v]);
    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    // Validate package.json
    const packageJson = JSON.parse(
      await fs.readFile(path.join(rootDir, 'package.json'), 'utf-8')
    );

    const requiredDeps = [
      'commander',
      'openai',
      'node-fetch',
      'replicate'
    ];

    const missingDeps = requiredDeps.filter(
      dep => !packageJson.dependencies[dep]
    );

    if (missingDeps.length > 0) {
      throw new Error(`Missing required dependencies: ${missingDeps.join(', ')}`);
    }

    console.log(boxen(
      chalk.green('Configuration validation successful!'),
      {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'green'
      }
    ));

  } catch (error) {
    console.error(boxen(
      chalk.red(`Configuration validation failed:\n${error.message}`),
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

validateConfig();
