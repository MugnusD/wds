"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCharacterStoryText = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var character_base_info_1 = require("../../../definitions/character_base_info");
function generateCharacterStoryText(characterInfo) {
    var firstStoryId = characterInfo.episodes.find(function (_) { return _.episodeOrder === 'First'; }).id;
    var secondStoryId = characterInfo.episodes.find(function (_) { return _.episodeOrder === 'Second'; }).id;
    return "===\u5361\u9762\u6545\u4E8B===\n{| class=\"wikitable mw-collapsible mw-collapsed\"\n! \u524D\u7BC7 !! \u540E\u7BC7\n|-\n|style=\"vertical-align: top;\" |".concat(getStoryText(firstStoryId), "\n|style=\"vertical-align: top;\" |").concat(getStoryText(secondStoryId), "\n|}\n{{\u89D2\u8272\u7D22\u5F15}}");
}
exports.generateCharacterStoryText = generateCharacterStoryText;
/**
 * 输入剧情 id，返回处理过的文本
 * @param {number} id
 * @returns {string}
 */
function getStoryText(id) {
    var dir = 'E:\\html_code\\src\\story';
    var storyData = fs_1.default.readFileSync(path_1.default.join(dir, id + '.json'), 'utf-8');
    var storyLines = JSON.parse(storyData);
    // 将同样 GroupLines 的对话对象合并到一个数组中
    var groupLines = storyLines.reduce(function (acc, line) {
        var groupOrder = line.groupOrder - 1;
        if (!acc[groupOrder]) {
            acc[groupOrder] = [];
        }
        acc[groupOrder].push(line);
        return acc;
    }, []);
    var lines = groupLines
        .map(function (groupLines) {
        var phrase;
        // 如果这个对话数组不止一个对象，那么把所有的 phrase 都合并在一起。如果只有一个对象，那么这个 phrase 就是新的属性值（避免使用
        // reduce 产生错误）。
        if (groupLines[1]) {
            phrase = groupLines.reduce(function (acc, line) { return acc.phrase + '<br />' + line.phrase; });
        }
        else {
            phrase = groupLines[0].phrase;
        }
        // 替换 phase 中的 /n 为 <br />
        phrase = phrase.replace('/n', '<br />');
        return {
            phrase: phrase,
            speakerIconId: groupLines[0].speakerIconId,
            speakerName: groupLines[0].speakerName,
        };
    })
        .filter(function (line) {
        return line.speakerIconId !== undefined;
    })
        // 给名字加上颜色
        .map(function (line) {
        var chara = character_base_info_1.characterBaseInfoArray.find(function (character) { return character.id.toString() === line.speakerIconId; });
        var speaker;
        if (chara) {
            speaker = chara.styledName.replace('{name}', line.speakerName);
        }
        else {
            speaker = '<span style="color: gray;font-weight: bold;">{name}</span>'.replace('{name}', line.speakerName);
        }
        var phrase = line.phrase;
        return speaker + '<br />' + phrase;
    });
    return lines.join('<br /><br />');
}
