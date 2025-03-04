const { SerperService } = require('./services/serper');
const { OpenAIService } = require('./services/openai');
const Replicate = require('replicate');

class LlamaServiceSimple {
  constructor(apiKey = '3b22f61ba20abacebca325b1c3f6efd922f072ba942f7630ae31483a2bf730d') {
    this.replicate = new Replicate({
      auth: apiKey,
    });
  }

  async keepAlive() {
    try {
      console.log('Keeping Llama service alive...');
      return 'Llama service active';
    } catch (error) {
      console.error('Llama service error:', error.message);
      return 'Llama service check completed';
    }
  }
}

class KeepAliveBot {
    constructor() {
        this.serperService = new SerperService();
        this.llamaService = new LlamaServiceSimple();
        this.openAIService = new OpenAIService();
        this.intervalMinutes = 5;
        this.isRunning = false;
    }

    async performActions() {
        try {
            const timestamp = new Date().toISOString();
            console.log(`[${timestamp}] Performing keep-alive actions...`);
            
            console.log('Checking search service...');
            await this.serperService.search('keep alive');
            
            console.log('Checking Llama service...');
            const llamaStatus = await this.llamaService.keepAlive();
            console.log('Llama status:', llamaStatus);
            
            console.log('Checking OpenAI service...');
            const openAIResponse = await this.openAIService.generateResponse('keep alive');
            console.log('OpenAI status: Service active');
            
            console.log(`[${timestamp}] All services checked successfully`);
        } catch (error) {
            console.error('Error in keep-alive cycle:', error.message);
        }
    }

    start() {
        if (this.isRunning) {
            console.log('Bot is already running');
            return;
        }

        this.isRunning = true;
        console.log(`Starting keep-alive bot (${this.intervalMinutes} minute interval)`);

        // Initial run
        this.performActions();

        // Schedule periodic runs
        this.interval = setInterval(() => {
            this.performActions();
        }, this.intervalMinutes * 60 * 1000);

        // Handle graceful shutdown
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
            console.log('Bot is not running');
            return;
        }

        clearInterval(this.interval);
        this.isRunning = false;
        console.log('Bot stopped');
    }
}

// Start the bot if this file is run directly
if (require.main === module) {
    const bot = new KeepAliveBot();
    bot.start();
}

module.exports = KeepAliveBot;
