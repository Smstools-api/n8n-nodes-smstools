import type {
  IDataObject,
  IExecuteFunctions,
  IHttpRequestOptions,
  INodeExecutionData,
  JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';
import { getSmstoolsBaseUrl } from '../../credentials/SmstoolsApi.credentials';

export async function smstoolsRequest(
  this: IExecuteFunctions,
  method: string,
  endpoint: string,
  body: IDataObject = {},
  qs: IDataObject = {},
) {
  const credentials = await this.getCredentials('smstoolsApi');

  // SEC-916: only https to an allowed Smstools host; refuse before any request is sent
  let baseUrl: string;
  try {
    baseUrl = getSmstoolsBaseUrl(credentials.baseUrl);
  } catch (error) {
    throw new NodeOperationError(this.getNode(), (error as Error).message);
  }
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  const options: IHttpRequestOptions = {
    method: method as IHttpRequestOptions['method'],
    url: `${baseUrl}${path}`,
    qs,
    json: true,
  };

  // GET requests are sent without a body
  if ((method || '').toUpperCase() !== 'GET') {
    options.body = body;
  }

  try {
    return await this.helpers.httpRequestWithAuthentication.call(this, 'smstoolsApi', options);
  } catch (error) {
    throw new NodeApiError(this.getNode(), error as JsonObject);
  }
}

export function asItems(data: unknown): INodeExecutionData[] {
  const arr: unknown[] = Array.isArray(data) ? data : [data];
  return arr.map((d) => ({ json: d as IDataObject }));
}