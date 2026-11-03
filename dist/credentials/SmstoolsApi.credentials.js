"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmstoolsApi = exports.SMSTOOLS_ALLOWED_HOSTS = exports.SMSTOOLS_DEFAULT_BASE_URL = void 0;
exports.getSmstoolsBaseUrl = getSmstoolsBaseUrl;
exports.SMSTOOLS_DEFAULT_BASE_URL = 'https://api.smstools.com';
exports.SMSTOOLS_ALLOWED_HOSTS = ['api.smstools.com', 'api.smsgatewayapi.com'];
const BASE_URL_ERROR = 'Smstools API: the Base URL must be https://api.smstools.com or https://api.smsgatewayapi.com. ' +
    'Other hosts and http:// are refused, so the client secret is never sent anywhere else.';
const ABSOLUTE_URL = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
function parseUrl(value) {
    try {
        return new URL(value);
    }
    catch {
        return undefined;
    }
}
function isAllowedSmstoolsUrl(url) {
    return (url !== undefined &&
        url.protocol === 'https:' &&
        exports.SMSTOOLS_ALLOWED_HOSTS.includes(url.hostname) &&
        url.username === '' &&
        url.password === '' &&
        (url.port === '' || url.port === '443'));
}
function getSmstoolsBaseUrl(value) {
    const raw = String(value !== null && value !== void 0 ? value : '').trim();
    const url = parseUrl(raw === '' ? exports.SMSTOOLS_DEFAULT_BASE_URL : raw);
    if (!isAllowedSmstoolsUrl(url) || url.pathname !== '/' || url.search !== '' || url.hash !== '') {
        throw new Error(BASE_URL_ERROR);
    }
    return `https://${url.hostname}`;
}
function assertSmstoolsRequestTarget(requestOptions) {
    var _a;
    const options = requestOptions;
    const targets = [options.url, options.uri]
        .filter((target) => typeof target === 'string' && target.trim() !== '')
        .map((target) => target.trim());
    let relative = targets.length === 0;
    for (const target of targets) {
        if (!ABSOLUTE_URL.test(target)) {
            relative = true;
        }
        else if (!isAllowedSmstoolsUrl(parseUrl(target))) {
            throw new Error(BASE_URL_ERROR);
        }
    }
    if (relative) {
        if (String((_a = options.baseURL) !== null && _a !== void 0 ? _a : '').trim() === '') {
            throw new Error(BASE_URL_ERROR);
        }
        getSmstoolsBaseUrl(options.baseURL);
    }
}
class SmstoolsApi {
    constructor() {
        this.name = 'smstoolsApi';
        this.displayName = 'Smstools API';
        this.icon = {
            light: 'file:../nodes/Smstools/smstools.svg',
            dark: 'file:../nodes/Smstools/smstools.dark.svg',
        };
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
                default: exports.SMSTOOLS_DEFAULT_BASE_URL,
                description: 'Base URL for Smstools API. Only https://api.smstools.com and https://api.smsgatewayapi.com are accepted.',
            },
        ];
        this.requestDefaults = {
            baseURL: '={{$credentials.baseUrl}}',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        this.test = {
            request: {
                method: 'GET',
                baseURL: `={{$credentials.baseUrl || "${exports.SMSTOOLS_DEFAULT_BASE_URL}"}}`,
                url: '/v1/auth',
            },
        };
    }
    async authenticate(credentials, requestOptions) {
        var _a, _b, _c;
        assertSmstoolsRequestTarget(requestOptions);
        requestOptions.headers = {
            ...((_a = requestOptions.headers) !== null && _a !== void 0 ? _a : {}),
            'X-Client-Id': String((_b = credentials.clientId) !== null && _b !== void 0 ? _b : ''),
            'X-Client-Secret': String((_c = credentials.clientSecret) !== null && _c !== void 0 ? _c : ''),
        };
        return requestOptions;
    }
}
exports.SmstoolsApi = SmstoolsApi;
//# sourceMappingURL=SmstoolsApi.credentials.js.map