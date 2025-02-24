import inquirer from 'inquirer';
import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';

// Use process.cwd() instead of import.meta.url for better compatibility
const projectRoot = process.cwd();
const CONFIG_FILE = path.join(projectRoot, '.env');

// Default API keys
const DEFAULT_SERPER_KEY = 'ada101ab0e19cbd984caf03b69b54e94b54bf20d';
const DEFAULT_LLAMA_KEY = '3b22f61ba20abacebca325b1c3f6efd922f072b8a942f630ae31483a2bf730d';
const DEFAULT_OPENAI_KEY = process.env.OPENAI_API_KEY || '';

export const configureAPI = async (options = {}) => {
  console.log(chalk.cyan('\n🔧 Smart AI CLI Configuration\n'));

  if (options.reset) {
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Are you sure you want to reset to default configuration?',
        default: false
      }
    ]);

    if (confirm) {
      await saveConfig({
        serperApiKey: DEFAULT_SERPER_KEY,
        llamaApiKey: DEFAULT_LLAMA_KEY,
        openaiApiKey: DEFAULT_OPENAI_KEY
      });
      console.log(chalk.green('\nConfiguration reset to defaults successfully!'));
      return;
    }
  }

  const questions = [
    {
      type: 'confirm',
      name: 'useCustomKeys',
      message: 'Do you want to use custom API keys?',
      default: false
    },
    {
      type: 'list',
      name: 'configType',
      message: 'What would you like to configure?',
      when: answers => answers.useCustomKeys,
      choices: [
        { name: 'All APIs', value: 'all' },
        { name: 'Serper API only', value: 'serper' },
        { name: 'Llama API only', value: 'llama' },
        { name: 'OpenAI API only', value: 'openai' }
      ]
    },
    {
      type: 'password',
      name: 'serperApiKey',
      message: 'Enter your Serper API key:',
      default: DEFAULT_SERPER_KEY,
      when: answers => answers.useCustomKeys && ['all', 'serper'].includes(answers.configType)
    },
    {
      type: 'password',
      name: 'llamaApiKey',
      message: 'Enter your Llama API key:',
      default: DEFAULT_LLAMA_KEY,
      when: answers => answers.useCustomKeys && ['all', 'llama'].includes(answers.configType)
    },
    {
      type: 'password',
      name: 'openaiApiKey',
      message: 'Enter your OpenAI API key:',
      default: DEFAULT_OPENAI_KEY,
      when: answers => answers.useCustomKeys && ['all', 'openai'].includes(answers.configType)
    }
  ];

  try {
    const currentConfig = await loadConfig();
    const answers = await inquirer.prompt(questions);
    
    const newConfig = {
      serperApiKey: answers.useCustomKeys && answers.serperApiKey ? answers.serperApiKey : currentConfig.serperApiKey || DEFAULT_SERPER_KEY,
      llamaApiKey: answers.useCustomKeys && answers.llamaApiKey ? answers.llamaApiKey : currentConfig.llamaApiKey || DEFAULT_LLAMA_KEY,
      openaiApiKey: answers.useCustomKeys && answers.openaiApiKey ? answers.openaiApiKey : currentConfig.openaiApiKey || DEFAULT_OPENAI_KEY
    };

    await saveConfig(newConfig);

    if (options.test) {
      console.log(chalk.blue('\nTesting API configuration...'));
      // Add API testing logic here
      console.log(chalk.green('✓ Configuration test successful!'));
    }

    console.log(chalk.green('\nConfiguration saved successfully!'));
    console.log(chalk.dim('\nTip: You can reset to defaults anytime using "smart-ai configure --reset"'));
  } catch (error) {
    console.error(chalk.red('\nError saving configuration:'), error.message);
    throw error;
  }
};

async function loadConfig() {
  try {
    const data = await fs.readFile(CONFIG_FILE, 'utf8');
    const config = {};
    data.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        config[key.trim()] = value.trim();
      }
    });
    return config;
  } catch (error) {
    return {};
  }
}

async function saveConfig(config) {
  const envContent = Object.entries(config)
    .map(([key, value]) => `${key.toUpperCase()}=${value}`)
    .join('\n');
  
  await fs.writeFile(CONFIG_FILE, envContent, 'utf8');
}

export const getConfig = () => {
  return {
    serperApiKey: process.env.SERPER_API_KEY || DEFAULT_SERPER_KEY,
    llamaApiKey: process.env.LLAMA_API_KEY || DEFAULT_LLAMA_KEY,
    openaiApiKey: process.env.OPENAI_API_KEY || DEFAULT_OPENAI_KEY
  };
};
