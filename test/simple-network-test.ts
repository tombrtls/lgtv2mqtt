#!/usr/bin/env node

import * as https from 'https';

interface RequestOptions {
    hostname: string;
    path: string;
    method: string;
    headers?: { [key: string]: string };
}

interface CallbackResult {
    error: Error | null;
    data?: any;
}

console.log('=== LG WebOS TV Network Test ===');
console.log('Node.js version:', process.version);
console.log('OpenSSL version:', process.versions.openssl);
console.log('Platform:', process.platform);
console.log('Architecture:', process.arch);

// Verify versions match LG WebOS TV
const expectedNode = 'v0.12.2';
const expectedOpenSSL = '1.0.2p';
const currentNode = process.version;
const currentOpenSSL = process.versions.openssl;

console.log('Expected Node.js:', expectedNode);
console.log('Current Node.js:', currentNode);
console.log('Node.js match:', currentNode === expectedNode ? '✅ Exact match' : '⚠️  Version mismatch');

console.log('Expected OpenSSL:', expectedOpenSSL);
console.log('Current OpenSSL:', currentOpenSSL);
console.log('OpenSSL match:', currentOpenSSL.indexOf('1.0.2') !== -1 ? '✅ Compatible' : '⚠️  Version mismatch');
console.log('');

// Simple network request function (same as your request.ts)
function makeRequest(options: RequestOptions, callback: (result: CallbackResult) => void): void {
    console.log(`Making request to: ${options.hostname}${options.path}`);
    
    const req = https.get(options, (res) => {
        console.log(`Response status: ${res.statusCode}`);
        
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            try {
                const jsonData = JSON.parse(data);
                console.log('✅ Success! JSON response received');
                console.log('Response preview:', JSON.stringify(jsonData).substring(0, 200) + '...');
                callback({ error: null, data: jsonData });
            } catch (err) {
                console.log('❌ JSON parsing failed:', (err as Error).message);
                console.log('Raw response:', data.substring(0, 200) + '...');
                callback({ error: err as Error, data: null });
            }
        });
    });
    
    req.on('error', (err) => {
        console.log('❌ Request failed:', err.message);
        callback({ error: err, data: null });
    });
    
    req.setTimeout(10000, () => {
        console.log('❌ Request timeout');
        req.destroy();
        callback({ error: new Error('Request timeout'), data: null });
    });
}

// Make the request to Open-Meteo (same as in your code)
const options: RequestOptions = {
    hostname: 'api.open-meteo.com',
    path: '/v1/forecast?latitude=52.37&longitude=4.9',
    method: 'GET',
    headers: {
        'User-Agent': 'LG-WebOS-TV/1.0'
    }
};

makeRequest(options, (result) => {
    if (result.error) {
        console.log('\n❌ Network test failed:', result.error.message);
        process.exit(1);
    } else {
        console.log('\n🎉 Network test successful!');
        console.log('Your LG WebOS TV environment can make external API calls.');
        process.exit(0);
    }
});
