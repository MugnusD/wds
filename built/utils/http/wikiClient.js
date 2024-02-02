"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var clinetFactory_1 = __importDefault(require("./clinetFactory"));
var form_data_1 = __importDefault(require("form-data"));
var WikiClient = /** @class */ (function () {
    function WikiClient(sessData, url) {
        if (url === void 0) { url = 'https://wiki.biligame.com/worlddaistar/api.php'; }
        this.client = (0, clinetFactory_1.default)();
        this.sessData = sessData;
        this.url = url;
        this.tokenPromise = this.initialToken();
    }
    /**
     * 返回一个 CSRFToken 的期约，用于任何 API 操作。
     */
    WikiClient.prototype.initialToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.get(this.url + '?action=query&meta=tokens&format=json', {
                                headers: {
                                    'Cookie': "SESSDATA=".concat(this.sessData),
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                },
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.query.tokens.csrftoken];
                    case 2:
                        e_1 = _a.sent();
                        console.log(e_1);
                        throw e_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    WikiClient.prototype.editPage = function (pageTitle, text, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, section, _b, nocreate, _c, summary, token, params, response, e_2;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = options.section, section = _a === void 0 ? 0 : _a, _b = options.nocreate, nocreate = _b === void 0 ? false : _b, _c = options.summary, summary = _c === void 0 ? '自动生成' : _c;
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.tokenPromise];
                    case 2:
                        token = _d.sent();
                        params = new URLSearchParams();
                        params.append('action', 'edit');
                        params.append('title', pageTitle);
                        params.append('text', text);
                        params.append('summary', summary);
                        params.append('token', token);
                        params.append('format', 'json');
                        if (section !== 0) {
                            params.append('section', section.toString());
                        }
                        if (nocreate) {
                            params.append('nocreate', nocreate.toString());
                        }
                        return [4 /*yield*/, this.client.post(this.url, params, {
                                headers: {
                                    'Cookie': "SESSDATA=".concat(this.sessData),
                                },
                            })];
                    case 3:
                        response = _d.sent();
                        return [2 /*return*/, "edit ".concat(pageTitle, " successfully")];
                    case 4:
                        e_2 = _d.sent();
                        console.log(e_2);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    WikiClient.prototype.uploadFile = function (fileName, localFilePath, ignoreWarning) {
        if (ignoreWarning === void 0) { ignoreWarning = false; }
        return __awaiter(this, void 0, void 0, function () {
            var token, fileStream, formData, response, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.tokenPromise];
                    case 1:
                        token = _a.sent();
                        fileStream = fs.createReadStream(localFilePath);
                        formData = new form_data_1.default();
                        formData.append('action', 'upload');
                        formData.append('filename', fileName);
                        formData.append('token', token);
                        formData.append('text', '上传测试');
                        formData.append('file', fileStream);
                        formData.append('format', 'json');
                        formData.append('ignorewarnings', ignoreWarning); // 记得删除掉
                        return [4 /*yield*/, this.client.post(this.url, formData, {
                                headers: __assign({ 'Cookie': "SESSDATA=".concat(this.sessData) }, formData.getHeaders())
                            })];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 3:
                        e_3 = _a.sent();
                        return [2 /*return*/, e_3];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return WikiClient;
}());
exports.default = WikiClient;
