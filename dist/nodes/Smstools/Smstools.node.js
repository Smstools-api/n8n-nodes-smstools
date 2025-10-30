"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Smstools = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
class Smstools {
    constructor() {
        this.description = {
            displayName: 'Smstools',
            name: 'smstools',
            icon: 'file:smsTools.svg',
            group: ['transform'],
            version: 1,
            description: 'Send sms or voice messages with the Smstools API',
            defaults: { name: 'Smstools' },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [{ name: 'smstoolsApi', required: true }],
            properties: [
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
                {
                    displayName: 'Date',
                    name: 'date',
                    type: 'string',
                    hint: 'yyyy-MM-DD HH:ii',
                    required: false,
                    default: '',
                    displayOptions: { show: { resource: ['message'], operation: ['send', 'send-voice'] } },
                    description: 'Format: yyyy-MM-dd HH:mm. If not provided, the message will be sent as soon as possible',
                },
                {
                    displayName: 'Reference',
                    name: 'reference',
                    type: 'string',
                    required: false,
                    default: '',
                    displayOptions: { show: { resource: ['message'], operation: ['send', 'send-voice'] } },
                    description: 'String of max. 255 characters',
                },
                {
                    displayName: 'Language',
                    name: 'language',
                    type: 'options',
                    options: [{ name: 'English', value: 'en' }, { name: 'Dutch', value: 'nl' }, { name: 'French', value: 'fr' }, { name: 'German', value: 'de' }],
                    required: false,
                    default: 'en',
                    displayOptions: { show: { resource: ['message'], operation: ['send-voice'] } },
                    description: 'Possible languages: en (default), nl, fr or de',
                },
                {
                    displayName: 'Gender',
                    name: 'gender',
                    type: 'options',
                    options: [{ name: 'Female', value: 'Female' }, { name: 'Male', value: 'Male' }],
                    required: false,
                    default: 'Female',
                    displayOptions: { show: { resource: ['message'], operation: ['send-voice'] } },
                    description: 'possible genders: "Female" (default), "Male"',
                },
                {
                    displayName: 'Test',
                    name: 'test',
                    type: 'boolean',
                    required: false,
                    default: false,
                    displayOptions: { show: { resource: ['message'], operation: ['send', 'send-voice'] } },
                    description: 'Test method without sending',
                },
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
    }
    async execute() {
        var _a, _b, _c, _d, _e, _f;
        const items = this.getInputData();
        const returnData = [];
        const resource = this.getNodeParameter('resource', 0);
        for (let i = 0; i < items.length; i++) {
            if (resource === 'message') {
                const operation = this.getNodeParameter('operation', i);
                if (operation === 'send') {
                    const sender = this.getNodeParameter('sender', i);
                    const to = this.getNodeParameter('to', i);
                    const message = this.getNodeParameter('message', i);
                    const test = this.getNodeParameter('test', i);
                    const date = (_a = this.getNodeParameter('date', i)) !== null && _a !== void 0 ? _a : '';
                    const reference = (_b = this.getNodeParameter('reference', i)) !== null && _b !== void 0 ? _b : '';
                    const body = {
                        sender,
                        to,
                        message,
                        date,
                        reference,
                        test,
                    };
                    const res = await GenericFunctions_1.smstoolsRequest.call(this, 'POST', '/v1/message/send', body);
                    returnData.push(...(0, GenericFunctions_1.asItems)(res));
                }
                if (operation === 'send-voice') {
                    const to = this.getNodeParameter('to', i);
                    const message = this.getNodeParameter('message', i);
                    const test = this.getNodeParameter('test', i);
                    const date = (_c = this.getNodeParameter('date', i)) !== null && _c !== void 0 ? _c : '';
                    const reference = (_d = this.getNodeParameter('reference', i)) !== null && _d !== void 0 ? _d : '';
                    const language = (_e = this.getNodeParameter('language', i)) !== null && _e !== void 0 ? _e : 'en';
                    const gender = (_f = this.getNodeParameter('gender', i)) !== null && _f !== void 0 ? _f : 'Female';
                    const body = {
                        to,
                        message,
                        date,
                        reference,
                        test,
                        language,
                        gender
                    };
                    const res = await GenericFunctions_1.smstoolsRequest.call(this, 'POST', '/v1/message/send', body);
                    returnData.push(...(0, GenericFunctions_1.asItems)(res));
                }
            }
            if (resource === 'account') {
                const op = this.getNodeParameter('accountOperation', i);
                if (op === 'auth') {
                    const res = await GenericFunctions_1.smstoolsRequest.call(this, 'GET', '/v1/auth');
                    returnData.push(...(0, GenericFunctions_1.asItems)(res));
                }
                if (op === 'balance') {
                    const res = await GenericFunctions_1.smstoolsRequest.call(this, 'GET', '/v1/balance');
                    returnData.push(...(0, GenericFunctions_1.asItems)(res));
                }
                if (op === 'senderids') {
                    const res = await GenericFunctions_1.smstoolsRequest.call(this, 'GET', '/v1/senderids');
                    returnData.push(...(0, GenericFunctions_1.asItems)(res));
                }
            }
            if (resource === 'tools') {
                const op = this.getNodeParameter('toolsOperation', i);
                if (op === 'formatNumber') {
                    const number = this.getNodeParameter('toolsNumber', i);
                    const res = await GenericFunctions_1.smstoolsRequest.call(this, 'POST', '/v1/format/number', {}, { number });
                    returnData.push(...(0, GenericFunctions_1.asItems)(res));
                }
            }
        }
        return [returnData];
    }
}
exports.Smstools = Smstools;
//# sourceMappingURL=Smstools.node.js.map