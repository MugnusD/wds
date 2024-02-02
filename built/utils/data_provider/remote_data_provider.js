"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteDataProvider = void 0;
var sirius_calculator_1 = require("sirius-calculator");
var fs_1 = __importDefault(require("fs"));
var RemoteDataProvider = /** @class */ (function () {
    function RemoteDataProvider() {
        var characterService = new sirius_calculator_1.CharacterService();
        this.characterDetailsPromise = characterService.getAllCharacterDetails();
    }
    RemoteDataProvider.prototype.fetchData = function () {
        return this.characterDetailsPromise;
    };
    RemoteDataProvider.prototype.downloadToLocalCache = function () {
        this.characterDetailsPromise
            .then(function (result) {
            fs_1.default.writeFileSync(__dirname + '/../../cache/all_character.json', JSON.stringify(result, null, 2));
        });
    };
    return RemoteDataProvider;
}());
exports.RemoteDataProvider = RemoteDataProvider;
