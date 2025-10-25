import { request } from "./request";

request({ hostname: 'api.open-meteo.com', path: '/v1/forecast?latitude=52.37&longitude=4.9', method: "GET" }, ({ error, data}) => {
    console.dir({ error, data })
    process.exit(0);
});