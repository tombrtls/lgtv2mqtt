import Service from 'webos-service';
import { LgTvMqtt, LgTvMqttConfig } from './lgtv-mqtt';

import { request } from './request';

const service = new Service("com.slg.lgtv2mqtt.service"); // Create service by service name on package.json

const config: LgTvMqttConfig = {
    host: 'mqtt.internal.brtls.org',
    port: 1883,
    username: 'YOUR MQTT USERNAME',
    password: 'YOUR MQTT PASSWORD',
    deviceID: 'webOSTVService'
};

// const lgTvMqtt = new LgTvMqtt(service, config);

service.register('start', message => {
    request({ hostname: 'api.open-meteo.com', path: '/v1/forecast?latitude=52.37&longitude=4.9', method: 'GET'}, ({ error, data }) => {
        message.respond({ error, data })
    });
});

service.register('stop', message => {

});

service.register('logs', message => {

});

service.register('clearLogs', message => {


});
service.register('getState', message => {

});

