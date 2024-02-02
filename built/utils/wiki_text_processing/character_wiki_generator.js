"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStoryText = exports.getCharacterTemplate = void 0;
var character_wikitext_1 = require("./methods/character_wikitext");
var story_wikitest_js_1 = require("./methods/story_wikitest.js");
function getCharacterTemplate(characterInfo) {
    return (0, character_wikitext_1.characterToWikiText)(characterInfo);
}
exports.getCharacterTemplate = getCharacterTemplate;
function getStoryText(characterInfo) {
    return (0, story_wikitest_js_1.generateCharacterStoryText)(characterInfo);
}
exports.getStoryText = getStoryText;
