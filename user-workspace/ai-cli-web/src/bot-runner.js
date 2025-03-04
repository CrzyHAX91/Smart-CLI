const Bot = require('./bot');

class BotRunner {
    constructor(intervalMinutes = 5) {
        this.bot = new Bot();
        this.intervalMinutes = intervalMinutes;
        this.isRunning = false;
    }

    start() {
        if (this.isRunning) {
            console.log('Bot runner is already running');
            return;
        }

        this.isRunning = true;
        console.log(`Starting bot runner with ${this.intervalMinutes} minute interval`);

        // Run immediately on start
        this.runBot();

        // Schedule periodic runs
        this.interval = setInterval(() => {
            this.runBot();
        }, this.intervalMinutes * 60 * 1000);
    }

    async runBot() {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] Running bot iteration`);
        
        try {
            await this.bot.run();
        } catch (error) {
            console.error(`[${timestamp}] Error in bot iteration:`, error);
        }
    }

    stop() {
        if (!this.isRunning) {
            console.log('Bot runner is not running');
            return;
        }

        clearInterval(this.interval);
        this.isRunning = false;
        console.log('Bot runner stopped');
    }
}

// Start the bot runner if this file is executed directly
if (require.main === module) {
    const runner = new BotRunner();
    runner.start();

    // Handle graceful shutdown
    process.on('SIGINT', () => {
        console.log('\nReceived SIGINT. Shutting down gracefully...');
        runner.stop();
        process.exit(0);
    });
}

module.exports = BotRunner;
