"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
class BaseService {
    baseUrl;
    headers;
    instanceId;
    constructor(baseUrl, headers, instanceId) {
        this.baseUrl = baseUrl;
        this.headers = headers;
        this.instanceId = instanceId;
    }
    replaceInstanceId(path, instanceId) {
        const in_id = this.instanceId || instanceId || "";
        if (!in_id) {
            throw new Error("Missing instanceId");
        }
        return path.replace("{instance_id}", in_id);
    }
    async request(method, path, body) {
        const requestOptions = {
            method,
            headers: this.headers,
            body: body ? JSON.stringify(body) : undefined,
        };
        try {
            const response = await fetch(`${this.baseUrl}${path}`, requestOptions);
            if (!response.ok) {
                const rawError = await response.text();
                return { data: null, error: JSON.parse(rawError) };
            }
            const data = await response.json();
            return { data, error: null };
        }
        catch (error) {
            return {
                data: null,
                error: {
                    name: "application_error",
                    message: "Unable to fetch data. The request could not be resolved.",
                },
            };
        }
    }
    async _get(path) {
        return this.request("GET", path);
    }
    async _post(path, body) {
        return this.request("POST", path, body);
    }
    async _put(path, body) {
        return this.request("PUT", path, body);
    }
    async _patch(path, body) {
        return this.request("PATCH", path, body);
    }
    async _delete(path) {
        return this.request("DELETE", path);
    }
}
exports.BaseService = BaseService;
