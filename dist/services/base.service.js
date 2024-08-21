"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
class BaseService {
    constructor(baseUrl, headers) {
        this.baseUrl = baseUrl;
        this.headers = headers;
    }
    request(method, path, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestOptions = {
                method,
                headers: this.headers,
                body: body ? JSON.stringify(body) : undefined,
            };
            try {
                const response = yield fetch(`${this.baseUrl}${this.endpoint}${path}`, requestOptions);
                if (!response.ok) {
                    const rawError = yield response.text();
                    return { data: null, error: JSON.parse(rawError) };
                }
                const data = yield response.json();
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
        });
    }
    get(path) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request("GET", path);
        });
    }
    post(path, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request("POST", path, body);
        });
    }
    put(path, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request("PUT", path, body);
        });
    }
    patch(path, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request("PATCH", path, body);
        });
    }
    delete(path) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request("DELETE", path);
        });
    }
}
exports.BaseService = BaseService;
