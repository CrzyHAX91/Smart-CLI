const http = require('http');
const { SerperService } = require('./services/serper');
const { OpenAIService } = require('./services/openai');

const port = process.env.PORT || 3000;

// Create services
const serperService = new SerperService();
const openAIService = new OpenAIService();

// Create HTTP server
const server = http.createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    
    try {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] Received request: ${req.method} ${req.url}`);

        // Perform keep-alive actions
        const status = {
            timestamp,
            services: {
                search: 'checking...',
                ai: 'checking...'
            }
        };

        try {
            await serperService.search('keep alive');
            status.services.search = 'active';
        } catch (error) {
            status.services.search = `error: ${error.message}`;
        }

        try {
            await openAIService.generateResponse('keep alive');
            status.services.ai = 'active';
        } catch (error) {
            status.services.ai = `error: ${error.message}`;
        }

        res.statusCode = 200;
        res.end(JSON.stringify(status, null, 2));
    } catch (error) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: error.message }));
    }
});

// Start server
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
    console.log('Send requests to this endpoint to keep the CLI alive');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\nShutting down server...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
