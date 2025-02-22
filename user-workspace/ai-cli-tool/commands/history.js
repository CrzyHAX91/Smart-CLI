import { HistoryManager } from '../utils/history.js';
import { OpenAIService } from '../services/openai.js';
import { getConfig } from '../utils/config.js';
import inquirer from 'inquirer';
import chalk from 'chalk';
import boxen from 'boxen';
import ora from 'ora';
import figlet from 'figlet';

const NEON_COLORS = [
  '#FF1B8D', // Neon Pink
  '#00FF9F', // Neon Green
  '#00F3FF', // Neon Blue
  '#FF3C00', // Neon Orange
  '#FF00FF'  // Neon Purple
];

function rainbow(str) {
  return str.split('').map((char, i) => {
    const color = NEON_COLORS[i % NEON_COLORS.length];
    return chalk.hex(color)(char);
  }).join('');
}

function createNeonBox(content, title = '') {
  return boxen(content, {
    title: title ? rainbow(title) : undefined,
    titleAlignment: 'center',
    borderStyle: 'double',
    borderColor: 'cyan',
    backgroundColor: '#000',
    padding: 1,
    margin: 1,
    float: 'center'
  });
}

async function getHistoryInsights(history, openai) {
  try {
    const prompt = `Analyze this command history and provide insights:
    ${JSON.stringify(history)}
    
    Return JSON with:
    {
      "patterns": ["3 most common patterns in questions"],
      "suggestions": ["3 suggested topics based on interests"],
      "complexity": "analysis of question complexity trend (increasing/decreasing)"
    }`;

    const response = await openai.generateResponse(prompt);
    return JSON.parse(response);
  } catch (error) {
    return {
      patterns: ['Unable to analyze patterns'],
      suggestions: ['Unable to generate suggestions'],
      complexity: 'Unable to analyze complexity'
    };
  }
}

export const historyCommand = async (options = {}) => {
  console.log('\n' + rainbow(figlet.textSync('History', { font: 'Slant' })));

  const spinner = ora({
    text: rainbow('🔍 Loading history...'),
    color: 'magenta'
  }).start();

  try {
    const history = new HistoryManager();
    const config = getConfig();
    const openai = new OpenAIService(config.openaiApiKey);
    const entries = await history.getHistory();

    if (entries.length === 0) {
      spinner.info(chalk.yellow('No history entries found.'));
      return;
    }

    spinner.succeed(chalk.greenBright(`📚 Found ${entries.length} history entries`));

    if (options.search) {
      spinner.text = rainbow('🔍 Searching history...');
      spinner.start();
      const results = entries.filter(entry => 
        entry.question.toLowerCase().includes(options.search.toLowerCase()) ||
        entry.response.toLowerCase().includes(options.search.toLowerCase())
      );

      spinner.succeed(chalk.greenBright(`🎯 Found ${results.length} matches`));
      displayResults(results, options.limit);
    } else if (options.interactive) {
      await interactiveBrowser(entries, openai);
    } else {
      // Get AI insights about usage patterns
      spinner.text = rainbow('🧠 Analyzing usage patterns...');
      spinner.start();
      const insights = await getHistoryInsights(entries, openai);
      spinner.succeed(chalk.greenBright('✨ Analysis complete'));

      // Display insights
      console.log(createNeonBox(
        `${chalk.cyan('Common Patterns:')}
${insights.patterns.map(p => `• ${p}`).join('\n')}

${chalk.cyan('Suggested Topics:')}
${insights.suggestions.map(s => `• ${s}`).join('\n')}

${chalk.cyan('Complexity Trend:')}
${insights.complexity}`,
        '🔮 AI Insights'
      ));

      // Display recent history
      displayResults(entries.slice(-options.limit || -5));
    }
  } catch (error) {
    spinner.fail(chalk.red('Error accessing history'));
    console.error(createNeonBox(error.message, '❌ Error'));
  }
};

function displayResults(entries, limit = 5) {
  entries.slice(-limit).forEach((entry, index) => {
    console.log(createNeonBox(
      `${chalk.cyan('Q:')} ${entry.question}\n\n${chalk.green('A:')} ${entry.response.slice(0, 200)}${entry.response.length > 200 ? '...' : ''}`,
      `${rainbow(`Entry #${index + 1}`)} ${chalk.dim(new Date(entry.timestamp).toLocaleString())}`
    ));
  });
}

async function interactiveBrowser(entries, openai) {
  const spinner = ora({
    text: rainbow('🎨 Preparing interactive browser...'),
    color: 'magenta'
  }).start();

  try {
    // Get AI-powered categories
    const categoriesPrompt = `Analyze these questions and suggest 5 categories:
    ${entries.map(e => e.question).join('\n')}
    Return only category names separated by commas.`;
    
    const categoriesResponse = await openai.generateResponse(categoriesPrompt);
    const categories = ['All', ...categoriesResponse.split(',').map(c => c.trim())];
    
    spinner.succeed(chalk.greenBright('✨ Ready to browse'));

    while (true) {
      const { category } = await inquirer.prompt([
        {
          type: 'list',
          name: 'category',
          message: rainbow('Choose a category to explore:'),
          choices: [...categories, 'Exit']
        }
      ]);

      if (category === 'Exit') break;

      let filtered = entries;
      if (category !== 'All') {
        const categoryPrompt = `Which of these questions belong to the category "${category}"? Return comma-separated indices (0-based):
        ${entries.map((e, i) => `${i}: ${e.question}`).join('\n')}`;
        
        const indicesResponse = await openai.generateResponse(categoryPrompt);
        const indices = indicesResponse.split(',').map(i => parseInt(i.trim())).filter(i => !isNaN(i));
        filtered = indices.map(i => entries[i]).filter(Boolean);
      }

      const { entry } = await inquirer.prompt([
        {
          type: 'list',
          name: 'entry',
          message: rainbow('Select an entry to view:'),
          choices: filtered.map((e, i) => ({
            name: `${i + 1}. ${e.question}`,
            value: e
          }))
        }
      ]);

      console.log(createNeonBox(
        `${chalk.cyan('Question:')} ${entry.question}\n\n${chalk.green('Answer:')} ${entry.response}`,
        rainbow('📜 History Entry')
      ));

      // Show related entries
      const relatedPrompt = `Find indices of 3 most related questions to: "${entry.question}"
      Questions:
      ${entries.map((e, i) => `${i}: ${e.question}`).join('\n')}
      Return only comma-separated indices.`;

      const relatedIndices = (await openai.generateResponse(relatedPrompt))
        .split(',')
        .map(i => parseInt(i.trim()))
        .filter(i => !isNaN(i));

      const related = relatedIndices.map(i => entries[i]).filter(Boolean);

      if (related.length > 0) {
        console.log(createNeonBox(
          related.map(r => `• ${r.question}`).join('\n'),
          '🔗 Related Questions'
        ));
      }
    }
  } catch (error) {
    console.error(createNeonBox(error.message, '❌ Error'));
  }
}

export const clearHistory = async () => {
  const spinner = ora({
    text: rainbow('🧹 Clearing history...'),
    color: 'magenta'
  }).start();

  try {
    const history = new HistoryManager();
    await history.clearHistory();
    spinner.succeed(chalk.greenBright('History cleared successfully!'));
  } catch (error) {
    spinner.fail(chalk.red('Error clearing history'));
    console.error(createNeonBox(error.message, '❌ Error'));
  }
};
