#!/usr/bin/env node

import { request } from './request';

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

// Make the request to Open-Meteo using the shared request function
const options = {
    hostname: 'api.open-meteo.com',
    path: '/v1/forecast?latitude=52.37&longitude=4.9',
    method: 'GET',
    headers: {
        'User-Agent': 'LG-WebOS-TV/1.0'
    }
};

console.log('Response preview:', JSON.stringify(options).substring(0, 200));

request(options, (result) => {
    if (result.error) {
        console.log('\n❌ Network test failed:', result.error.message);
        process.exit(1);
    } else {
        console.log('\n🎉 Network test successful!');
        console.log('Your LG WebOS TV environment can make external API calls.');
        console.log('Data preview:', JSON.stringify(result.data).substring(0, 200) + '...');
        process.exit(0);
    }
});