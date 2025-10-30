import type { INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
export declare class Smstools implements INodeType {
    description: INodeTypeDescription;
    execute(this: any): Promise<INodeExecutionData[][]>;
}
