import type {
  IDataObject,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

import { smstoolsRequest, asItems } from './GenericFunctions';

export class Smstools implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Smstools',
    name: 'smstools',
    icon: 'file:smstools.svg',
    group: ['transform'],
    version: 1,
    usableAsTool: true,
    description: 'Send sms or voice messages with the Smstools API',
    defaults: { name: 'Smstools' },
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    credentials: [{ name: 'smstoolsApi', required: true }],
    properties: [
      // Resource
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Message', value: 'message' },
          { name: 'Account', value: 'account' },
          { name: 'Tools', value: 'tools' },
        ],
        default: 'message',
      },

      // MESSAGE
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: { show: { resource: ['message'] } },
        options: [
          { name: 'Send message', value: 'send' },
          { name: 'Send voice message', value: 'send-voice' },
        ],
        default: 'send',
      },
      {
        displayName: 'Sender',
        name: 'sender',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['message'], operation: ['send'] } },
        description: 'Alphanumeric or numeric sender',
      },
      {
        displayName: 'To',
        name: 'to',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['message'], operation: ['send', 'send-voice'] } },
        description: 'Destination MSISDN (E.164)',
      },
      {
        displayName: 'Message',
        name: 'message',
        type: 'string',
        required: true,
        typeOptions: { rows: 4 },
        default: '',
        displayOptions: { show: { resource: ['message'], operation: ['send', 'send-voice'] } },
      },

      // Any Option field should be under an Additional Fields/Options collection
      {
        displayName: 'Additional Options',
        name: 'messageAdditionalOptions',
        type: 'collection',
        placeholder: 'Add option',
        default: {},
        displayOptions: { show: { resource: ['message'], operation: ['send', 'send-voice'] } },
        options: [
          {
            displayName: 'Date',
            name: 'date',
            type: 'string',
            hint: 'yyyy-MM-DD HH:mm',
            default: '',
            description:
              'Format: yyyy-MM-dd HH:mm. If not provided, the message will be sent as soon as possible',
          },
          {
            displayName: 'Reference',
            name: 'reference',
            type: 'string',
            default: '',
            description: 'String of max. 255 characters',
          },
          {
            displayName: 'Test',
            name: 'test',
            type: 'boolean',
            default: false,
            description: 'Test method without sending',
          },
        ],
      },

      {
        displayName: 'Language',
        name: 'language',
        type: 'options',
        options: [
          { name: 'English', value: 'en' },
          { name: 'Dutch', value: 'nl' },
          { name: 'French', value: 'fr' },
          { name: 'German', value: 'de' },
        ],
        required: false,
        default: 'en',
        displayOptions: { show: { resource: ['message'], operation: ['send-voice'] } },
        description: 'Possible languages: en (default), nl, fr or de',
      },
      {
        displayName: 'Gender',
        name: 'gender',
        type: 'options',
        options: [
          { name: 'Female', value: 'Female' },
          { name: 'Male', value: 'Male' },
        ],
        required: false,
        default: 'Female',
        displayOptions: { show: { resource: ['message'], operation: ['send-voice'] } },
        description: 'possible genders: "Female" (default), "Male"',
      },

      // ACCOUNT
      {
        displayName: 'Operation',
        name: 'accountOperation',
        type: 'options',
        displayOptions: { show: { resource: ['account'] } },
        options: [
          { name: 'Auth Info', value: 'auth' },
          { name: 'Get Balance', value: 'balance' },
          { name: 'Get Sender Ids', value: 'senderids' },
        ],
        default: 'auth',
      },

      // TOOLS
      {
        displayName: 'Operation',
        name: 'toolsOperation',
        type: 'options',
        displayOptions: { show: { resource: ['tools'] } },
        options: [{ name: 'Format Number', value: 'formatNumber' }],
        default: 'formatNumber',
      },
      {
        displayName: 'Number',
        name: 'toolsNumber',
        type: 'string',
        default: '',
        required: true,
        displayOptions: { show: { resource: ['tools'], toolsOperation: ['formatNumber'] } },
      },
    ],
  };

  async execute(this: any): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const resource = this.getNodeParameter('resource', i) as string;

        if (resource === 'message') {
          const operation = this.getNodeParameter('operation', i) as string;

          const additional = (this.getNodeParameter(
            'messageAdditionalOptions',
            i,
            {},
          ) as IDataObject) ?? {};

          const date = (additional.date as string) ?? '';
          const reference = (additional.reference as string) ?? '';
          const test = (additional.test as boolean) ?? false;

          if (operation === 'send') {
            const sender = this.getNodeParameter('sender', i) as string;
            const to = this.getNodeParameter('to', i) as string;
            const message = this.getNodeParameter('message', i) as string;

            const body: IDataObject = {
              sender,
              to,
              message,
              date,
              reference,
              test,
            };

            const res = await smstoolsRequest.call(this, 'POST', '/v1/message/send', body);

            const out = asItems(res).map((d) => ({
              ...d,
              pairedItem: { item: i },
            }));

            returnData.push(...out);
          }

          if (operation === 'send-voice') {
            const to = this.getNodeParameter('to', i) as string;
            const message = this.getNodeParameter('message', i) as string;
            const language = (this.getNodeParameter('language', i) as string) ?? 'en';
            const gender = (this.getNodeParameter('gender', i) as string) ?? 'Female';

            const body: IDataObject = {
              to,
              message,
              date,
              reference,
              test,
              language,
              gender,
            };

            const res = await smstoolsRequest.call(this, 'POST', '/v1/voice/send', body);

            const out = asItems(res).map((d) => ({
              ...d,
              pairedItem: { item: i },
            }));

            returnData.push(...out);
          }
        }

        if (resource === 'account') {
          const op = this.getNodeParameter('accountOperation', i) as string;

          if (op === 'auth') {
            const res = await smstoolsRequest.call(this, 'GET', '/v1/auth');
            const out = asItems(res).map((d) => ({ ...d, pairedItem: { item: i } }));
            returnData.push(...out);
          }

          if (op === 'balance') {
            const res = await smstoolsRequest.call(this, 'GET', '/v1/balance');
            const out = asItems(res).map((d) => ({ ...d, pairedItem: { item: i } }));
            returnData.push(...out);
          }

          if (op === 'senderids') {
            const res = await smstoolsRequest.call(this, 'GET', '/v1/senderids');
            const out = asItems(res).map((d) => ({ ...d, pairedItem: { item: i } }));
            returnData.push(...out);
          }
        }

        if (resource === 'tools') {
          const op = this.getNodeParameter('toolsOperation', i) as string;

          if (op === 'formatNumber') {
            const number = this.getNodeParameter('toolsNumber', i) as string;
            const res = await smstoolsRequest.call(
              this,
              'POST',
              '/v1/format/number',
              {},
              { number },
            );

            const out = asItems(res).map((d) => ({ ...d, pairedItem: { item: i } }));
            returnData.push(...out);
          }
        }
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: (error as Error).message,
            },
            pairedItem: { item: i },
          });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}