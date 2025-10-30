import {
  IDataObject,
  INodeExecutionData,
  NodeApiError,
  IHttpRequestOptions,
} from 'n8n-workflow';


export async function smstoolsRequest(
  this: any,
  method: string,
  endpoint: string,
  body: IDataObject = {},
  qs: IDataObject = {},
) {
  const credentials = await this.getCredentials('smstoolsApi');
  const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');
  const clientId = credentials.clientId as string;
  const clientSecret = credentials.clientSecret as string;

  // Altijd credentials meesturen (v1)
  if ((method || '').toUpperCase() === 'GET') {
    qs.client_id = clientId;
    qs.client_secret = clientSecret;
  }

  const options: IHttpRequestOptions = {
    method: method as IHttpRequestOptions['method'],
    url: `${baseUrl}${endpoint}`,
    qs,
    body,
    headers: { 'Content-Type': 'application/json', 'X-Client-Id': clientId, 'X-Client-Secret': clientSecret },
    json: true,
  };

  try {
    return await this.helpers.httpRequest(options);
  } catch (error) {
    throw new NodeApiError(this.getNode(), error);
  }
}

export function asItems(data: any): INodeExecutionData[] {
  const arr = Array.isArray(data) ? data : [data];
  return arr.map((d) => ({ json: d }));
}
