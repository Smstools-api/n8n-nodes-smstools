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
                default: 'https://api.smstools.com',
                description: 'Base URL for Smstools API (change only for private gateway).',
            },
        ];
        this.requestDefaults = {
            baseURL: '={{$credentials.baseUrl}}',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    'X-Client-Id': '={{$credentials.clientId}}',
                    'X-Client-Secret': '={{$credentials.clientSecret}}',
                },
            },
        };
        this.test = {
            request: {
                method: 'GET',
                baseURL: '={{$credentials.baseUrl}}',
                url: '/v1/auth',
            },
        };
    }
}
exports.SmstoolsApi = SmstoolsApi;
//# sourceMappingURL=SmstoolsApi.credentials.js.map