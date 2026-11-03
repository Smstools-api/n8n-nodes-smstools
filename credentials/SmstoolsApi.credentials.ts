import type {
	ICredentialDataDecryptedObject,
	ICredentialTestRequest,
	ICredentialType,
	IHttpRequestOptions,
	Icon,
	INodeProperties,
} from 'n8n-workflow';

// The client secret may only be sent over https to an official Smstools API host (SEC-916).
export const SMSTOOLS_DEFAULT_BASE_URL = 'https://api.smstools.com';
export const SMSTOOLS_ALLOWED_HOSTS = ['api.smstools.com', 'api.smsgatewayapi.com'];

const BASE_URL_ERROR =
	'Smstools API: the Base URL must be https://api.smstools.com or https://api.smsgatewayapi.com. ' +
	'Other hosts and http:// are refused, so the client secret is never sent anywhere else.';

const ABSOLUTE_URL = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;

function parseUrl(value: string): URL | undefined {
	try {
		return new URL(value);
	} catch {
		return undefined;
	}
}

function isAllowedSmstoolsUrl(url: URL | undefined): url is URL {
	return (
		url !== undefined &&
		url.protocol === 'https:' &&
		SMSTOOLS_ALLOWED_HOSTS.includes(url.hostname) &&
		url.username === '' &&
		url.password === '' &&
		(url.port === '' || url.port === '443')
	);
}

/**
 * Validates the Base URL of the credential and returns it as https://<host>.
 * Empty falls back to the default; anything other than an allowed host over https throws.
 */
export function getSmstoolsBaseUrl(value: unknown): string {
	const raw = String(value ?? '').trim();
	const url = parseUrl(raw === '' ? SMSTOOLS_DEFAULT_BASE_URL : raw);
	if (!isAllowedSmstoolsUrl(url) || url.pathname !== '/' || url.search !== '' || url.hash !== '') {
		throw new Error(BASE_URL_ERROR);
	}
	return `https://${url.hostname}`;
}

/**
 * Throws unless the request goes to an allowed Smstools host over https.
 * httpRequestWithAuthentication uses url (+ baseURL), the legacy requestWithAuthentication uses uri.
 */
function assertSmstoolsRequestTarget(requestOptions: IHttpRequestOptions): void {
	const options = requestOptions as IHttpRequestOptions & { uri?: unknown };
	const targets = [options.url, options.uri]
		.filter((target): target is string => typeof target === 'string' && target.trim() !== '')
		.map((target) => target.trim());
	let relative = targets.length === 0;
	for (const target of targets) {
		if (!ABSOLUTE_URL.test(target)) {
			relative = true;
		} else if (!isAllowedSmstoolsUrl(parseUrl(target))) {
			throw new Error(BASE_URL_ERROR);
		}
	}
	if (relative) {
		// A relative url is resolved against baseURL, which must then be set and allowed
		if (String(options.baseURL ?? '').trim() === '') {
			throw new Error(BASE_URL_ERROR);
		}
		getSmstoolsBaseUrl(options.baseURL);
	}
}

export class SmstoolsApi implements ICredentialType {
	name = 'smstoolsApi';
	displayName = 'Smstools API';
	icon: Icon = {
		light: 'file:../nodes/Smstools/smstools.svg',
		dark: 'file:../nodes/Smstools/smstools.dark.svg',
	};
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
			default: SMSTOOLS_DEFAULT_BASE_URL,
			description:
				'Base URL for Smstools API. Only https://api.smstools.com and https://api.smsgatewayapi.com are accepted.',
		},
	];

	requestDefaults = {
		baseURL: '={{$credentials.baseUrl}}',
		headers: {
			'Content-Type': 'application/json',
		},
	};

	// A function instead of generic headers: the target is checked before the secret is added,
	// for the credential test, this node and any other node that uses this credential.
	async authenticate(
		credentials: ICredentialDataDecryptedObject,
		requestOptions: IHttpRequestOptions,
	): Promise<IHttpRequestOptions> {
		assertSmstoolsRequestTarget(requestOptions);
		requestOptions.headers = {
			...(requestOptions.headers ?? {}),
			'X-Client-Id': String(credentials.clientId ?? ''),
			'X-Client-Secret': String(credentials.clientSecret ?? ''),
		};
		return requestOptions;
	}

	test: ICredentialTestRequest = {
		request: {
			method: 'GET',
			baseURL: `={{$credentials.baseUrl || "${SMSTOOLS_DEFAULT_BASE_URL}"}}`,
			url: '/v1/auth',
		},
	};
}
