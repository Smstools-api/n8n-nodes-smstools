import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
export declare function smstoolsRequest(this: IExecuteFunctions, method: string, endpoint: string, body?: IDataObject, qs?: IDataObject): Promise<any>;
export declare function asItems(data: unknown): INodeExecutionData[];
