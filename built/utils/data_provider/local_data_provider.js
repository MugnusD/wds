"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalDataProvider = void 0;
var fs_1 = __importDefault(require("fs"));
var LocalDataProvider = /** @class */ (function () {
    function LocalDataProvider() {
    }
    LocalDataProvider.prototype.fetchData = function () {
        var data = fs_1.default.readFileSync(__dirname + '/../../cache/all_character.json', "utf-8");
        return Promise.resolve(JSON.parse(data));
    };
    return LocalDataProvider;
}());
exports.LocalDataProvider = LocalDataProvider;
