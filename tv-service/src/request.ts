import http from 'http'

export function request(options: any, cb: (args: {error: Error | null, data?: any}) => void) {
  console.log("Starting request")
  http.get(options, (res: any) => {
    console.log("Response received")
    let data = '';
    res.on('data', (chunk: any) => data += chunk);
    res.on('end', () => {
      try {
        cb({ error: null, data: JSON.parse(data)});
      } catch (err) {
        cb({ error: err as Error, data: null});
      }
    });
  }).on('error', (err: Error) => {
    cb({ error: err, data: null});
  }).end();
}