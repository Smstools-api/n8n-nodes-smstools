"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smstoolsRequest = smstoolsRequest;
exports.asItems = asItems;
const n8n_workflow_1 = require("n8n-workflow");
const SmstoolsApi_credentials_1 = require("../../credentials/SmstoolsApi.credentials");
async function smstoolsRequest(method, endpoint, body = {}, qs = {}) {
    const credentials = await this.getCredentials('smstoolsApi');
    let baseUrl;
    try {
        baseUrl = (0, SmstoolsApi_credentials_1.getSmstoolsBaseUrl)(credentials.baseUrl);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), error.message);
    }
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const options = {
        method: method,
        url: `${baseUrl}${path}`,
        qs,
        json: true,
    };
    if ((method || '').toUpperCase() !== 'GET') {
        options.body = body;
    }
    try {
        return await this.helpers.httpRequestWithAuthentication.call(this, 'smstoolsApi', options);
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