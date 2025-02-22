import chalk from 'chalk';
import boxen from 'boxen';
import { OpenAIService } from './openai.js';
import { LlamaService } from './llama.js';

export class SuggestionsEngine {
  constructor() {
    this.openai = new OpenAIService();
    this.llama = new LlamaService();
    
    this.defaultSuggestions = {
      relatedQuestions: [
        'Tell me more about the history',
        'What are the key landmarks',
        'How to get there'
      ],
      powerOptions: [
        'Use --detailed for comprehensive analysis',
        'Try --quick for faster responses'
      ],
      approaches: [
        'Break down the question into smaller parts',
        'Specify a particular aspect to focus on'
      ]
    };
  }

  async getSmartPrompt(query) {
    try {
      // Use OpenAI to enhance the query
      const enhancedQuery = await this.openai.generateResponse(
        `Enhance this CLI command or query for better results: ${query}`
      );
      return enhancedQuery;
    } catch (error) {
      console.error('Error enhancing query:', error);
      return query;
    }
  }

  async getSuggestions(query) {
    try {
      // Get command suggestions from Llama
      const llamaSuggestions = await this.llama.generateResponse(
        `Given the CLI command or query "${query}", suggest:
        1. Three related commands or questions
        2. Three power options or flags to enhance the command
        3. Three different approaches to achieve the same goal
        Format the response as JSON with keys: relatedQuestions, powerOptions, approaches`
      );

      let parsedSuggestions;
      try {
        parsedSuggestions = JSON.parse(llamaSuggestions);
      } catch (error) {
        console.error('Error parsing Llama response:', error);
        parsedSuggestions = this.defaultSuggestions;
      }

      return {
        relatedQuestions: parsedSuggestions.relatedQuestions || this.getRelatedQuestions(query),
        powerOptions: parsedSuggestions.powerOptions || this.defaultSuggestions.powerOptions,
        approaches: parsedSuggestions.approaches || this.defaultSuggestions.approaches
      };
    } catch (error) {
      console.error('Error getting suggestions:', error);
      return {
        relatedQuestions: this.getRelatedQuestions(query),
        powerOptions: this.defaultSuggestions.powerOptions,
        approaches: this.defaultSuggestions.approaches
      };
    }
  }

  getRelatedQuestions(query) {
    // Generate related questions based on the query
    return [
      `Tell me more about ${query}`,
      `What are the latest developments in ${query}?`,
      `What are the historical aspects of ${query}?`
    ];
  }

  displaySuggestions(suggestions) {
    // Display Related Questions
    console.log(
      boxen(
        chalk.bold('💡 Related Commands & Questions') + '\n\n' +
        suggestions.relatedQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n'),
        {
          padding: 1,
          margin: 1,
          borderStyle: 'single',
          borderColor: 'yellow'
        }
      )
    );

    // Display Power Options
    console.log(
      boxen(
        chalk.bold('⚡ Power Options & Flags') + '\n\n' +
        suggestions.powerOptions.map((opt, i) => `${i + 1}. ${opt}`).join('\n'),
        {
          padding: 1,
          margin: 1,
          borderStyle: 'single',
          borderColor: 'blue'
        }
      )
    );

    // Display Different Approaches
    console.log(
      boxen(
        chalk.bold('🔄 Alternative Approaches') + '\n\n' +
        suggestions.approaches.map((app, i) => `${i + 1}. ${app}`).join('\n'),
        {
          padding: 1,
          margin: 1,
          borderStyle: 'single',
          borderColor: 'magenta'
        }
      )
    );
  }
}
