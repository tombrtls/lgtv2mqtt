import * as https from 'https'

export function request(options: any, cb: (args: {error: Error | null, data?: any}) => void) {
  console.log("Starting request")
  https.get(options, (res: any) => {
    console.log("Response received")
    let data = '';
    res.on('data', (chunk: any) => data += chunk);
    res.on('end', () => {

      try {
        cb({ error: null, data: {
          statusCode: res.statusCode,
          data: JSON.parse(data)
        }});
      } catch (err) {
        cb({ error: err as Error, data: {
          statusCode: res.statusCode,
          data: null
        }});
      }
    });
  }).on('error', (err: Error) => {
    cb({ error: err, data: {
      statusCode: 0,
      data: null
    }});
  }).end();
}