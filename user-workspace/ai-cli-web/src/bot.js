const { SerperService } = require('./services/serper');
const { LlamaService } = require('./services/llama');
const { OpenAIService } = require('./services/openai');

class Bot {
  constructor() {
    this.serperService = new SerperService();
    this.llamaService = new LlamaService();
    this.openAIService = new OpenAIService();
  }

  async run() {
    console.log('Bot is running...');
    
    try {
      // Perform a search
      const searchResult = await this.serperService.search('AI CLI');
      console.log('Search result:', searchResult);

      // Generate text with Llama
      const llamaResult = await this.llamaService.generateText('Tell me about AI CLIs');
      console.log('Llama result:', llamaResult);

      // Generate text with OpenAI
      const openAIResult = await this.openAIService.generateText('Explain the benefits of AI CLIs');
      console.log('OpenAI result:', openAIResult);

    } catch (error) {
      console.error('Error running bot:', error);
    }
  }
}

module.exports = Bot;

// Run the bot if this file is executed directly
if (require.main === module) {
  const bot = new Bot();
  bot.run();
}
