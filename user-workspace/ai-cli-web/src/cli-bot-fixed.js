const { SerperService } = require('./services/serper');
const { LlamaService } = require('./services/llama');
const { OpenAIService } = require('./services/openai');

class CliBot {
    constructor() {
        this.serperService = new SerperService();
        this.llamaService = new LlamaService();
        this.openAIService = new OpenAIService();
        this.intervalMinutes = 5;
        this.isRunning = false;
    }

    async performActions() {
        try {
            // Keep CLI alive by performing periodic actions
            const timestamp = new Date().toISOString();
            console.log(`[${timestamp}] Performing CLI keep-alive actions...`);
            
            // Perform a search to keep search service active
            await this.serperService.search('AI CLI keep alive');
            
            // Generate response with Llama to keep LLM service active
            await this.llamaService.generateResponse('Keep CLI active');
            
            // Generate response with OpenAI to keep API active
            await this.openAIService.generateResponse('Maintain CLI connection');
            
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

        // Run immediately on start
        this.performActions();

        // Schedule periodic runs
        this.interval = setInterval(() => {
            this.performActions();
        }, this.intervalMinutes * 60 * 1000);

        // Handle process termination
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
if (require.main === module) {
    const bot = new CliBot();
    bot.start();
}

module.exports = CliBot;
