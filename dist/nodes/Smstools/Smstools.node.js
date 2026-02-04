"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Smstools = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
class Smstools {
    constructor() {
        this.description = {
            displayName: 'Smstools',
            name: 'smstools',
            icon: 'file:smstools.svg',
            group: ['transform'],
            version: 1,
            usableAsTool: true,
            description: 'Send sms or voice messages with the Smstools API',
            defaults: { name: 'Smstools' },
            inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
            outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
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
                            description: 'Format: yyyy-MM-dd HH:mm. If not provided, the message will be sent as soon as possible',
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
        for (let i = 0; i < items.length; i++) {
            try {
                const resource = this.getNodeParameter('resource', i);
                if (resource === 'message') {
                    const operation = this.getNodeParameter('operation', i);
                    const additional = (_a = this.getNodeParameter('messageAdditionalOptions', i, {})) !== null && _a !== void 0 ? _a : {};
                    const date = (_b = additional.date) !== null && _b !== void 0 ? _b : '';
                    const reference = (_c = additional.reference) !== null && _c !== void 0 ? _c : '';
                    const test = (_d = additional.test) !== null && _d !== void 0 ? _d : false;
                    if (operation === 'send') {
                        const sender = this.getNodeParameter('sender', i);
                        const to = this.getNodeParameter('to', i);
                        const message = this.getNodeParameter('message', i);
                        const body = {
                            sender,
                            to,
                            message,
                            date,
                            reference,
                            test,
                        };
                        const res = await GenericFunctions_1.smstoolsRequest.call(this, 'POST', '/v1/message/send', body);
                        const out = (0, GenericFunctions_1.asItems)(res).map((d) => ({
                            ...d,
                            pairedItem: { item: i },
                        }));
                        returnData.push(...out);
                    }
                    if (operation === 'send-voice') {
                        const to = this.getNodeParameter('to', i);
                        const message = this.getNodeParameter('message', i);
                        const language = (_e = this.getNodeParameter('language', i)) !== null && _e !== void 0 ? _e : 'en';
                        const gender = (_f = this.getNodeParameter('gender', i)) !== null && _f !== void 0 ? _f : 'Female';
                        const body = {
                            to,
                            message,
                            date,
                            reference,
                            test,
                            language,
                            gender,
                        };
                        const res = await GenericFunctions_1.smstoolsRequest.call(this, 'POST', '/v1/voice/send', body);
                        const out = (0, GenericFunctions_1.asItems)(res).map((d) => ({
                            ...d,
                            pairedItem: { item: i },
                        }));
                        returnData.push(...out);
                    }
                }
                if (resource === 'account') {
                    const op = this.getNodeParameter('accountOperation', i);
                    if (op === 'auth') {
                        const res = await GenericFunctions_1.smstoolsRequest.call(this, 'GET', '/v1/auth');
                        const out = (0, GenericFunctions_1.asItems)(res).map((d) => ({ ...d, pairedItem: { item: i } }));
                        returnData.push(...out);
                    }
                    if (op === 'balance') {
                        const res = await GenericFunctions_1.smstoolsRequest.call(this, 'GET', '/v1/balance');
                        const out = (0, GenericFunctions_1.asItems)(res).map((d) => ({ ...d, pairedItem: { item: i } }));
                        returnData.push(...out);
                    }
                    if (op === 'senderids') {
                        const res = await GenericFunctions_1.smstoolsRequest.call(this, 'GET', '/v1/senderids');
                        const out = (0, GenericFunctions_1.asItems)(res).map((d) => ({ ...d, pairedItem: { item: i } }));
                        returnData.push(...out);
                    }
                }
                if (resource === 'tools') {
                    const op = this.getNodeParameter('toolsOperation', i);
                    if (op === 'formatNumber') {
                        const number = this.getNodeParameter('toolsNumber', i);
                        const res = await GenericFunctions_1.smstoolsRequest.call(this, 'POST', '/v1/format/number', {}, { number });
                        const out = (0, GenericFunctions_1.asItems)(res).map((d) => ({ ...d, pairedItem: { item: i } }));
                        returnData.push(...out);
                    }
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            error: error.message,
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
exports.Smstools = Smstools;
//# sourceMappingURL=Smstools.node.js.map