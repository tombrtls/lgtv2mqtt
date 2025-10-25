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

export function request(options: RequestOptions, cb: (result: CallbackResult) => void): void {
  console.log(`Making request to: ${options.hostname}${options.path}`);
  
  const req = https.get(options, (res) => {
    console.log(`Response status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        console.log('✅ Success! JSON response received');
        cb({ error: null, data: jsonData });
      } catch (err) {
        console.log('❌ JSON parsing failed:', (err as Error).message);
        cb({ error: err as Error, data: null });
      }
    });
  });
  
  req.on('error', (err) => {
    console.log('❌ Request failed:', err.message);
    cb({ error: err, data: null });
  });
  
  req.setTimeout(10000, () => {
    console.log('❌ Request timeout');
    req.destroy();
    cb({ error: new Error('Request timeout'), data: null });
  });
}