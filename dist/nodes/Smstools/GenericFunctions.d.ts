import type { IDataObject, INodeExecutionData } from 'n8n-workflow';
export declare function smstoolsRequest(this: any, method: string, endpoint: string, body?: IDataObject, qs?: IDataObject): Promise<any>;
export declare function asItems(data: any): INodeExecutionData[];
