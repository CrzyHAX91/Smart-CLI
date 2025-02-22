import { getConfig } from '../utils/config.js';
import { AIOrchestrator } from '../services/orchestrator.js';
import { SuggestionsEngine } from '../services/suggestions.js';
import ora from 'ora';
import chalk from 'chalk';
import boxen from 'boxen';
import fs from 'fs/promises';
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

export const askQuestion = async (question, options = {}) => {
  // Display fancy header
  console.log('\n' + rainbow(figlet.textSync('Smart AI', { font: 'Slant' })));

  const spinner = ora({
    text: rainbow('🤖 Initializing AI systems...'),
    color: 'magenta'
  }).start();

  try {
    const config = getConfig();
    const orchestrator = new AIOrchestrator(config);
    const suggestions = new SuggestionsEngine(config);

    // Get smart prompt improvement
    spinner.text = rainbow('🧠 Optimizing your question...');
    const improvedQuestion = await suggestions.getSmartPrompt(question);
    
    if (improvedQuestion !== question) {
      spinner.succeed(chalk.greenBright('Question optimized!'));
      console.log(
        createNeonBox(
          `${chalk.dim('Original:')} ${question}\n${chalk.cyan('Optimized:')} ${improvedQuestion}`,
          '✨ Question Enhancement'
        )
      );
    }

    // Process the question
    spinner.text = rainbow('🔮 Consulting multiple AI models...');
    spinner.color = 'cyan';

    const result = await orchestrator.processQuery(improvedQuestion, {
      quick: options.quick || false,
      detailed: options.detailed || false
    });

    // Format and display the response
    spinner.succeed(chalk.greenBright('✨ Response ready!'));

    // Display question and response in neon boxes
    console.log(
      createNeonBox(
        chalk.bold(improvedQuestion),
        '🤔 Question'
      )
    );

    // Format the response based on source
    const responseTitle = result.source === 'cache' 
      ? `📦 Cached Response (${new Date(result.timestamp).toLocaleString()})`
      : '🎯 AI Response';

    console.log(
      createNeonBox(
        result.response,
        responseTitle
      )
    );

    // Save to file if requested
    if (options.save) {
      try {
        const content = `Question: ${improvedQuestion}\n\nResponse:\n${result.response}\n\nGenerated on: ${new Date().toISOString()}`;
        await fs.writeFile(options.save, content, 'utf8');
        console.log(createNeonBox(
          chalk.greenBright(`Response saved to ${options.save}`),
          '💾 Saved'
        ));
      } catch (error) {
        console.error(createNeonBox(
          chalk.redBright(`Error saving to file: ${error.message}`),
          '❌ Error'
        ));
      }
    }

    // Show source information if available
    if (result.searchResults && !options.quick) {
      console.log(
        createNeonBox(
          chalk.dim(result.searchResults),
          '🔍 Sources'
        )
      );
    }

    // Generate and display AI suggestions
    spinner.text = rainbow('🎨 Generating smart suggestions...');
    const smartSuggestions = await suggestions.getSuggestions(improvedQuestion, {
      responseType: result.source,
      hasSearchResults: !!result.searchResults
    });

    console.log(
      createNeonBox(
        '🚀 Here are some smart suggestions to enhance your experience:',
        '💡 AI Suggestions'
      )
    );
    
    suggestions.displaySuggestions(smartSuggestions);

    // Show performance stats
    const stats = {
      responseTime: '< 1 second',
      aiModels: 'OpenAI + Llama + Serper',
      cacheStatus: result.source === 'cache' ? 'Hit' : 'Miss',
      enhancementApplied: improvedQuestion !== question
    };

    console.log(
      createNeonBox(
        Object.entries(stats)
          .map(([key, value]) => `${chalk.cyan(key)}: ${value}`)
          .join('\n'),
        '📊 Performance Stats'
      )
    );

  } catch (error) {
    spinner.fail(chalk.redBright('Error processing your question'));
    console.error(
      createNeonBox(
        chalk.red(error.message),
        '❌ Error'
      )
    );
    
    // Provide helpful error messages in neon box
    if (error.message.includes('API')) {
      console.log(
        createNeonBox(
          chalk.yellow('Try running "smart-ai configure" to update your API keys.'),
          '💡 Tip'
        )
      );
    } else {
      console.log(
        createNeonBox(
          chalk.yellow('Try using --quick mode or check your internet connection.'),
          '💡 Tip'
        )
      );
    }
  }
};
