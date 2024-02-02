"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.characterToWikiText = void 0;
var character_base_info_1 = require("../../../definitions/character_base_info");
// 角色属性
var attribute2wiki = {
    Cute: 1, Cool: 2, Colorful: 3, Cheerful: 4,
};
// 光
var type2Wiki = {
    Support: "支援系", Amplification: "增幅系", Special: "特殊系", Control: "支配系",
};
// 颜色
var type2Color = {
    Support: "绿", Control: "红", Amplification: "黄", Special: "蓝",
};
/**
 * 将 sa 条件转化为 wiki 的模板
 *
 * 检测 sa 开花前 和 开花后的需求，如果两个光相等则值表示一个数字，否则表示为 {开花前需求}-{开花后需求} 的格式。
 * 比如 1 1 4 1 和 1 1 3 1 的条件，那么显示为 |绿=1|红=1|黄=4/3|蓝=1
 * 对于 0 0 0 2 这种则只写 |绿=|红=|黄=|蓝=2
 */
function saCondition(character) {
    var lightTypes = ["Support", "Control", "Amplification", "Special"];
    return lightTypes
        .map(function (lightType) {
        var lightCondition = character.starAct.conditions.find(function (it) { return it.type === lightType; });
        var origin = lightCondition.origin;
        var bloom = lightCondition.bloom;
        var colorPre = "|" + type2Color[lightType] + "=";
        if (origin === 0) {
            return colorPre;
        }
        if (origin === bloom) {
            return colorPre + origin.toString();
        }
        else {
            return colorPre + origin.toString() + '/' + bloom.toString();
        }
    })
        .join('');
}
var initialTime = new Date('2022-12-31T15:00:00.000Z').getTime();
/**
 * 解释 ISO 日期字符串，然后转化为诸如 2000.1.1 的字符串形式。如果是 2022-12-31T15:00:00.000Z 则转化为开服日期。
 */
function displayDateConvert(startDate) {
    if (startDate.getTime() === initialTime) {
        return "2023.07.26";
    }
    else {
        var year = startDate.getFullYear().toString();
        var month = (startDate.getMonth() + 1).toString().padStart(2, '0'); // getMonth 从 0 开始
        var day = (startDate.getDate()).toString().padStart(2, '0'); // getDate 从 1 开始
        return "".concat(year, ".").concat(month, ".").concat(day);
    }
}
/**
 * 将 Character 转化为 wiki 文本形式
 */
function characterToWikiText(character) {
    var _a;
    var fileName = "Card ".concat(character.id, " 0.png");
    var name = character.name;
    // const charaName = character.characterBase;
    var charaName = character_base_info_1.characterBaseInfoArray
        .find(function (characterInfo) { return characterInfo.name === character.characterBase; })
        .chineseName;
    var rarity = character.rarity[4];
    var fileNameAwaken = rarity === '4' ? "Card ".concat(character.id, " 1.png") : '';
    var attribute = attribute2wiki[character.attribute];
    var sense = character.sense.descriptionsChinese.join('<br/>');
    var lightType = (_a = type2Wiki[character.sense.type]) !== null && _a !== void 0 ? _a : '无';
    var coolTimeInfo = character.sense.coolTime;
    var coolTimeOrigin = coolTimeInfo.origin;
    var coolTimeBloom = coolTimeInfo.bloom;
    var coolTime = coolTimeOrigin === 0 ? '-' :
        coolTimeOrigin === coolTimeBloom ?
            coolTimeOrigin.toString() :
            coolTimeOrigin.toString() + '/' + coolTimeBloom.toString();
    // const coolTime = character.sense.coolTime.origin.toString() + "/" + character.sense.coolTime.bloom.toString();
    var condition = saCondition(character);
    var saDescription = character.starAct.descriptionChinese;
    var status = character.status.find(function (it) { return it.preset.level === 1; });
    var vocal = status.status.vocal;
    var expression = status.status.expression;
    var concentration = status.status.concentration;
    var performance = vocal + expression + concentration;
    var statusBloom = character.status.find(function (it) { return it.preset.level !== 1; });
    var vocalBloom = statusBloom.status.vocal;
    var expressionBloom = statusBloom.status.expression;
    var concentrationBloom = statusBloom.status.concentration;
    var performanceBloom = vocalBloom + expressionBloom + concentrationBloom;
    var _b = character.bloomBonuses
        .map(function (it) {
        return it.descriptionsChinese.join("<br/>");
    }), phase1 = _b[0], phase2 = _b[1], phase3 = _b[2], phase4 = _b[3], _phase5 = _b[4];
    var film = '';
    switch (rarity) {
        case '1':
            film = '<br/>摄影胶卷【月】';
            break;
        case '2':
            film = '<br/>摄影胶卷【风】';
            break;
        case '3':
            film = '<br/>摄影胶卷【花】';
            break;
        case '4':
            film = "<br/>SP\u6444\u5F71\u80F6\u5377\u3010".concat(charaName, "\u3011");
            break;
    }
    var phase5 = _phase5 + film;
    // const phase5 = _phase5 + (rarity === '4' ? `<br/>SP摄影胶卷【${charaName}】` : '');
    var event = character.event;
    var displayTime = displayDateConvert(new Date(character.displayStartAt));
    return "{{\u5361\u9762\u4FE1\u606F\n|\u56FE\u7247=".concat(fileName, "\n|\u89C9\u9192\u540E\u56FE\u7247=").concat(fileNameAwaken, "\n|\u6F14\u5458\u540D\u79F0=").concat(name, "\n|\u89D2\u8272\u540D=").concat(charaName, "\n|\u661F\u7EA7=").concat(rarity, "\n|\u5C5E\u6027=").concat(attribute, "\n|\u6280\u80FD\u6548\u679C=").concat(sense, "\n|\u5149=").concat(lightType, "\n|CT=").concat(coolTime, "\n|Star Act=").concat(saDescription, "\n").concat(condition, "\n|\u6B4C\u5531\u529B=").concat(vocal, "\n|\u6B4C\u5531\u529B\u6700\u5927\u5F3A\u5316=").concat(vocalBloom, "\n|\u8868\u73B0\u529B=").concat(expression, "\n|\u8868\u73B0\u529B\u6700\u5927\u5F3A\u5316=").concat(expressionBloom, "\n|\u96C6\u4E2D\u529B=").concat(concentration, "\n|\u96C6\u4E2D\u529B\u6700\u5927\u5F3A\u5316=").concat(concentrationBloom, "\n|\u6F14\u6280\u529B=").concat(performance, "\n|\u6F14\u6280\u529B\u6700\u5927\u5F3A\u5316=").concat(performanceBloom, "\n|\u4E00\u82B1\u6548\u679C=").concat(phase1, "\n|\u4E8C\u82B1\u6548\u679C=").concat(phase2, "\n|\u4E09\u82B1\u6548\u679C=").concat(phase3, "\n|\u56DB\u82B1\u6548\u679C=").concat(phase4, "\n|\u4E94\u82B1\u6548\u679C=").concat(phase5, "\n|\u96B6\u5C5E\u6D3B\u52A8=").concat(event, "\n|\u767B\u573A\u65F6\u95F4=").concat(displayTime, "\n}}\n==\u5361\u9762\u4FE1\u606F==\n===\u5361\u9762\u76F8\u5173===\n===\u5361\u9762\u7B80\u8BC4===\n===\u5361\u9762\u6545\u4E8B===\n====\u524D\u7BC7====\n====\u540E\u7BC7====\n{{\u89D2\u8272\u7D22\u5F15}}\n");
}
exports.characterToWikiText = characterToWikiText;
