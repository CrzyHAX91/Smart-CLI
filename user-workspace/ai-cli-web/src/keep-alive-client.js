const http = require('http');

const interval = 5 * 60 * 1000; // 5 minutes
const url = 'http://localhost:3000/';

function sendRequest() {
    http.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            console.log(new Date().toISOString(), 'Keep-alive request sent. Response:', data);
        });
    }).on('error', (err) => {
        console.error(new Date().toISOString(), 'Error sending keep-alive request:', err.message);
    });
}

console.log('Starting keep-alive client...');
sendRequest(); // Send first request immediately
setInterval(sendRequest, interval);

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\nStopping keep-alive client...');
    process.exit(0);
});
