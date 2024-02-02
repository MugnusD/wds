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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WikiUploader = void 0;
var wikiClient_1 = __importDefault(require("./http/wikiClient"));
var remote_data_provider_1 = require("./data_provider/remote_data_provider");
var local_data_provider_1 = require("./data_provider/local_data_provider");
var character_wiki_generator_1 = require("./wiki_text_processing/character_wiki_generator");
var WikiUploader = /** @class */ (function () {
    function WikiUploader(sessData, useRemoteData) {
        if (useRemoteData === void 0) { useRemoteData = false; }
        this.characterDetailsPromise = this.createDataPromise(useRemoteData);
        this.wc = new wikiClient_1.default(sessData);
    }
    WikiUploader.prototype.createDataPromise = function (useRemoteData) {
        var dataProvider;
        if (useRemoteData) {
            dataProvider = new remote_data_provider_1.RemoteDataProvider();
        }
        else {
            dataProvider = new local_data_provider_1.LocalDataProvider();
        }
        var currentTime = Date.now();
        return dataProvider
            .fetchData()
            // 此处添加初步筛选处理程序，去掉开头的非角色卡，和没有实装的卡
            .then(function (characterInfos) {
            return characterInfos
                .filter(function (character) {
                var displayTime = new Date(character.displayStartAt).getTime();
                return character.id > 114514 && displayTime < currentTime;
            });
        });
    };
    /**
     * 上传指定角色（id）的故事
     * @param id 角色卡面 id
     */
    WikiUploader.prototype.uploadCharacterStory = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var characterDetails, characterDetail, storyText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.characterDetailsPromise];
                    case 1:
                        characterDetails = _a.sent();
                        characterDetail = characterDetails.find(function (_) { return _.id === id; });
                        storyText = (0, character_wiki_generator_1.getStoryText)(characterDetail);
                        return [2 /*return*/, this.wc.editPage(characterDetail.name, storyText, {
                                section: 4,
                                nocreate: true,
                            })
                                .then(function (msg) {
                                return '故事上传：' + msg;
                            })];
                }
            });
        });
    };
    WikiUploader.prototype.uploadAllCharacterStory = function () {
        return __awaiter(this, void 0, void 0, function () {
            var characterDetails;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.characterDetailsPromise];
                    case 1:
                        characterDetails = _a.sent();
                        characterDetails.forEach(function (characterInfo) {
                            _this.wc.editPage(characterInfo.name, (0, character_wiki_generator_1.getStoryText)(characterInfo), {
                                section: 4,
                                nocreate: true,
                            })
                                .then(function (msg) {
                                return '故事上传：' + msg;
                            })
                                .then(console.log);
                        });
                        return [2 /*return*/, '准备上传'];
                }
            });
        });
    };
    return WikiUploader;
}());
exports.WikiUploader = WikiUploader;
