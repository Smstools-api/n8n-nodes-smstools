"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmstoolsApi = void 0;
class SmstoolsApi {
    constructor() {
        this.name = 'smstoolsApi';
        this.displayName = 'Smstools API';
        this.documentationUrl = 'https://www.smstools.be/nl/sms-gateway-api/send_message';
        this.properties = [
            {
                displayName: 'Client ID',
                name: 'clientId',
                type: 'string',
                default: '',
                required: true,
                description: 'Your Smstools API client ID as provided in the dashboard.',
            },
            {
                displayName: 'Client Secret',
                name: 'clientSecret',
                type: 'string',
                typeOptions: { password: true },
                default: '',
                required: true,
                description: 'Your Smstools API client secret.',
            },
            {
                displayName: 'Base URL',
                name: 'baseUrl',
                type: 'string',
                default: 'https://api.smsgatewayapi.com',
                description: 'Base URL for Smstools API (change only for private gateway).',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Client-Id': '={{$credentials.clientId}}',
                    'X-Client-Secret': '={{$credentials.clientSecret}}',
                },
                body: {},
            },
        };
        this.test = {
            request: {
                method: 'GET',
                baseURL: '={{$credentials.baseUrl}}',
                url: '/v1/auth',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Client-Id': '={{$credentials.clientId}}',
                    'X-Client-Secret': '={{$credentials.clientSecret}}',
                },
            },
        };
    }
}
exports.SmstoolsApi = SmstoolsApi;
//# sourceMappingURL=SmstoolsApi.credentials.js.map