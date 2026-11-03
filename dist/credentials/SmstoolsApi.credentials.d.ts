import type { ICredentialDataDecryptedObject, ICredentialTestRequest, ICredentialType, IHttpRequestOptions, Icon, INodeProperties } from 'n8n-workflow';
export declare const SMSTOOLS_DEFAULT_BASE_URL = "https://api.smstools.com";
export declare const SMSTOOLS_ALLOWED_HOSTS: string[];
export declare function getSmstoolsBaseUrl(value: unknown): string;
export declare class SmstoolsApi implements ICredentialType {
    name: string;
    displayName: string;
    icon: Icon;
    documentationUrl: string;
    properties: INodeProperties[];
    requestDefaults: {
        baseURL: string;
        headers: {
            'Content-Type': string;
        };
    };
    authenticate(credentials: ICredentialDataDecryptedObject, requestOptions: IHttpRequestOptions): Promise<IHttpRequestOptions>;
    test: ICredentialTestRequest;
}
