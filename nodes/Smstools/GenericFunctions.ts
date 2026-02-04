import type { IDataObject, INodeExecutionData, IHttpRequestOptions } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

export async function smstoolsRequest(
  this: any,
  method: string,
  endpoint: string,
  body: IDataObject = {},
  qs: IDataObject = {},
) {
  const credentials = await this.getCredentials('smstoolsApi');
  const baseUrl = String(credentials.baseUrl || '').replace(/\/$/, '');
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  const options: IHttpRequestOptions = {
    method: method as IHttpRequestOptions['method'],
    url: `${baseUrl}${path}`,
    qs,
    body,
    json: true,
  };

  if ((method || '').toUpperCase() === 'GET') {
    delete (options as any).body;
  }

  try {
    return await this.helpers.httpRequestWithAuthentication.call(this, 'smstoolsApi', options);
  } catch (error) {
    throw new NodeApiError(this.getNode(), error);
  }
}

export function asItems(data: any): INodeExecutionData[] {
  const arr = Array.isArray(data) ? data : [data];
  return arr.map((d) => ({ json: d }));
}