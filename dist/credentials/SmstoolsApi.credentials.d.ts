import type { IAuthenticateGeneric, ICredentialTestRequest, ICredentialType, INodeProperties } from 'n8n-workflow';
export declare class SmstoolsApi implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    properties: INodeProperties[];
    requestDefaults: {
        baseURL: string;
        headers: {
            'Content-Type': string;
        };
    };
    authenticate: IAuthenticateGeneric;
    test: ICredentialTestRequest;
}
