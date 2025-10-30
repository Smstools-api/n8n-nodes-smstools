import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class SmstoolsApi implements ICredentialType {
	name = 'smstoolsApi';
	displayName = 'Smstools API';
	documentationUrl = 'https://www.smstools.be/nl/sms-gateway-api/send_message';

	properties: INodeProperties[] = [
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

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'Content-Type': 'application/json',
				'X-Client-Id' : '={{$credentials.clientId}}',
				'X-Client-Secret' : '={{$credentials.clientSecret}}',
			},
			body: {},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			method: 'GET',
			baseURL: '={{$credentials.baseUrl}}',
			url: '/v1/auth',
			headers: {
				'Content-Type': 'application/json',
				'X-Client-Id' : '={{$credentials.clientId}}',
				'X-Client-Secret' : '={{$credentials.clientSecret}}',
			},
		},
	};
}
