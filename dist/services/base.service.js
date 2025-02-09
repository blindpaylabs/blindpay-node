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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.BaseService = void 0;
var BaseService = /** @class */ (function () {
    function BaseService(baseUrl, headers, instanceId) {
        this.baseUrl = baseUrl;
        this.headers = headers;
        this.instanceId = instanceId;
    }
    BaseService.prototype.replaceInstanceId = function (path, instanceId) {
        var in_id = this.instanceId || instanceId || "";
        if (!in_id) {
            throw new Error("Missing instanceId");
        }
        return path.replace("{instance_id}", in_id);
    };
    BaseService.prototype.request = function (method, path, body) {
        return __awaiter(this, void 0, void 0, function () {
            var requestOptions, response, rawError, data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestOptions = {
                            method: method,
                            headers: this.headers,
                            body: body ? JSON.stringify(body) : undefined
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, fetch("".concat(this.baseUrl).concat(path), requestOptions)];
                    case 2:
                        response = _a.sent();
                        if (!!response.ok) return [3 /*break*/, 4];
                        return [4 /*yield*/, response.text()];
                    case 3:
                        rawError = _a.sent();
                        return [2 /*return*/, { data: null, error: JSON.parse(rawError) }];
                    case 4: return [4 /*yield*/, response.json()];
                    case 5:
                        data = _a.sent();
                        return [2 /*return*/, { data: data, error: null }];
                    case 6:
                        error_1 = _a.sent();
                        return [2 /*return*/, {
                                data: null,
                                error: {
                                    name: "application_error",
                                    message: "Unable to fetch data. The request could not be resolved."
                                }
                            }];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    BaseService.prototype._get = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request("GET", path)];
            });
        });
    };
    BaseService.prototype._post = function (path, body) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request("POST", path, body)];
            });
        });
    };
    BaseService.prototype._put = function (path, body) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request("PUT", path, body)];
            });
        });
    };
    BaseService.prototype._patch = function (path, body) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request("PATCH", path, body)];
            });
        });
    };
    BaseService.prototype._delete = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request("DELETE", path)];
            });
        });
    };
    return BaseService;
}());
exports.BaseService = BaseService;
