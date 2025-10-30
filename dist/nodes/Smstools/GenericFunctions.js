"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smstoolsRequest = smstoolsRequest;
exports.asItems = asItems;
const n8n_workflow_1 = require("n8n-workflow");
async function smstoolsRequest(method, endpoint, body = {}, qs = {}) {
    const credentials = await this.getCredentials('smstoolsApi');
    const baseUrl = credentials.baseUrl.replace(/\/$/, '');
    const clientId = credentials.clientId;
    const clientSecret = credentials.clientSecret;
    if ((method || '').toUpperCase() === 'GET') {
        qs.client_id = clientId;
        qs.client_secret = clientSecret;
    }
    const options = {
        method: method,
        url: `${baseUrl}${endpoint}`,
        qs,
        body,
        headers: { 'Content-Type': 'application/json', 'X-Client-Id': clientId, 'X-Client-Secret': clientSecret },
        json: true,
    };
    try {
        return await this.helpers.httpRequest(options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
function asItems(data) {
    const arr = Array.isArray(data) ? data : [data];
    return arr.map((d) => ({ json: d }));
}
//# sourceMappingURL=GenericFunctions.js.map