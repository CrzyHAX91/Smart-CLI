import { SerperService } from './services/serper.js';
import { OpenAIService } from './services/openai.js';
import Replicate from 'replicate';

class LlamaServiceUpdated {
  constructor(apiKey = '3b22f61ba20abacebca325b1c3f6efd922f072ba942f7630ae31483a2bf730d') {
    this.replicate = new Replicate({
      auth: apiKey,
    });
  }

  async generateResponse(prompt) {
    try {
      const output = await this.replicate.run(
        "meta/llama-2-70b-chat:02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3",
        {
          input: {
            prompt,
            max_length: 500,
            temperature: 0.7,
            top_p: 0.9,
            repetition_penalty: 1.1
          }
        }
      );

      return output.join('');
    } catch (error) {
      console.error('Llama API error:', error.message);
      return 'API call failed, but keeping CLI alive';
    }
  }
}

class CliBot {
    constructor() {
        this.serperService = new SerperService();
        this.llamaService = new LlamaServiceUpdated();
        this.openAIService = new OpenAIService();
        this.intervalMinutes = 5;
        this.isRunning = false;
    }

    async performActions() {
        try {
            const timestamp = new Date().toISOString();
            console.log(`[${timestamp}] Performing CLI keep-alive actions...`);
            
            await this.serperService.search('AI CLI keep alive');
            
            const llamaResponse = await this.llamaService.generateResponse('Keep CLI active');
            console.log('Llama response:', llamaResponse);
            
            const openAIResponse = await this.openAIService.generateResponse('Maintain CLI connection');
            console.log('OpenAI response:', openAIResponse);
            
            console.log(`[${timestamp}] Keep-alive actions completed successfully`);
        } catch (error) {
            console.error('Error performing keep-alive actions:', error);
        }
    }

    start() {
        if (this.isRunning) {
            console.log('CLI bot is already running');
            return;
        }

        this.isRunning = true;
        console.log(`Starting CLI bot with ${this.intervalMinutes} minute interval`);

        this.performActions();

        this.interval = setInterval(() => {
            this.performActions();
        }, this.intervalMinutes * 60 * 1000);

        process.on('SIGINT', () => {
            this.stop();
            process.exit(0);
        });

        process.on('SIGTERM', () => {
            this.stop();
            process.exit(0);
        });
    }

    stop() {
        if (!this.isRunning) {
            console.log('CLI bot is not running');
            return;
        }

        clearInterval(this.interval);
        this.isRunning = false;
        console.log('CLI bot stopped');
    }
}

// Create and start the bot if this file is run directly
if (import.meta.url === new URL(import.meta.url).href) {
    const bot = new CliBot();
    bot.start();
}

export default CliBot;
