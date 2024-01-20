const cal = require('sirius-calculator');
const fs = require('fs');
const path = require('path');

/**
 * @typedef {Object} Character
 * @property {number} id
 * @property {number} characterBaseMasterId
 * @property {string} name
 * @property {string} description
 * @property {null|string} assetId
 * @property {string} rarity
 * @property {string} attribute
 * @property {{ vocal: number, expression: number, concentration: number }} minLevelStatus
 * @property {number} starActMasterId
 * @property {null|number} awakenStarActMasterId
 * @property {number} senseMasterId
 * @property {boolean} forbidGenericItemBloom
 * @property {number} bloomBonusGroupMasterId
 * @property {number} senseEnhanceItemGroupMasterId
 * @property {number} firstEpisodeReleaseItemGroupId
 * @property {number} secondEpisodeReleaseItemGroupId
 * @property {null|number} characterAwakeningItemGroupMasterId
 * @property {string} displayStartAt
 * @property {string} displayEndAt
 */

// 角色属性
const attribute2wiki = {
    Cute: 1, Cool: 2, Colorful: 3, Cheerful: 4,
}

// 光
const type2Wiki = {
    Support: "支援系", Amplification: "增强系", Special: "特殊系", Control: "支配系",
}

// 颜色
const type2Color = {
    supportLight: "绿", controlLight: "红", amplificationLight: "黄", specialLight: "蓝",
}

/**
 * 将 sa 条件转化为 wiki 的模板
 *
 * @param character
 * @returns {string}
 */
function saCondition(character) {
    const lightTypes = ["supportLight", "controlLight", "amplificationLight", "specialLight"];

    return lightTypes
        .map(lightType => {
            const origin = character.starAct.condition.origin[lightType];
            const bloom = character.starAct.condition.bloom[lightType];
            const colorPre = "|" + type2Color[lightType] + "=";

            if (origin === bloom) {
                return colorPre + origin.toString();
            } else {
                return colorPre + origin.toString() + "-" + bloom.toString();
            }
        })
        .join('');
}

/**
 * 解释 ISO 日期字符串，然后转化为诸如 2000.1.1 的字符串形式。如果是 2023-1-1 则转化为开服日期。
 *
 * @param {string} startDate - ISO 日期字符串
 * @returns {string} - 返回字符串
 */
function displayDateConvert(startDate) {
    if (startDate === "2022-12-31T15:00:00.000Z") {
        return "2023.07.26";
    } else {
        const date = new Date(startDate);
        return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${(date.getDay() + 1).toString().padStart(2, '0')}`
    }
}

/**
 * 服务于最后角色信息期约的 then 处理程序
 *
 * @param character 接受期约的 result/value
 */
function characterToWikiText(character) {
    const name = character.name;
    const charaName = character.characterBase;
    const rarity = character.rarity[4];
    const attribute = attribute2wiki[character.attribute];
    const starAct = character.starAct.description;
    const lightType = type2Wiki[character.sense.type];
    const coolTime = character.sense.coolTime.origin.toString() + "-" + character.sense.coolTime.bloom.toString();
    const condition = saCondition(character);

    const status = character.status.find(it => it.preset.level === 1);
    const vocal = status.status.vocal;
    const expression = status.status.expression;
    const concentration = status.status.concentration;
    const performance = vocal + expression + concentration;

    const statusBloom = character.status.find(it => it.preset.level !== 1);
    const vocalBloom = statusBloom.status.vocal;
    const expressionBloom = statusBloom.status.expression;
    const concentrationBloom = statusBloom.status.concentration;
    const performanceBloom = vocalBloom + expressionBloom + concentrationBloom;

    const [phase1, phase2, phase3, phase4, phase5] = character.bloomBonuses
        .map(it => {
            return it.descriptions.join("<br/>");
        })

    const event = character.event;
    const displayTime = displayDateConvert(character.displayStartAt);


    return `{{卡面信息
|图片=
|觉醒后图片=
|演员名称=${name}
|角色名=${charaName}
|星级=${rarity}
|属性=${attribute}
|技能效果=${starAct}
|光=${lightType}
|CT=${coolTime}
${condition}
|歌唱力=${vocal}
|歌唱力最大强化=${vocalBloom}
|表现力=${expression}
|表现力最大强化=${expressionBloom}
|集中力=${concentration}
|集中力最大强化=${concentrationBloom}
|演技力=${performance}
|演技力最大强化=${performanceBloom}
|一花效果=${phase1}
|二花效果=${phase2}
|三花效果=${phase3}
|四花效果=${phase4}
|五花效果=${phase5}
|隶属活动=${event}
|登场时间=${displayTime}
}}`
}

// CharacterMaster.json 读取
const charaData = fs.readFileSync('CharacterMaster.json', 'utf-8');
/** @type {Character[]} */
const characterArray = JSON.parse(charaData);
const currentTime = Date.now();

const characterService = new cal.CharacterService();
const scriptDirectory = __dirname;

// const testData = fs.readFileSync( scriptDirectory + "/out/120010-夢見る少女.json", 'utf-8');
// const testCharacter = JSON.parse(testData);
// console.log(characterToWikiText(testCharacter));


characterArray
    .filter(it => { // 筛选掉开头的非角色卡、排除还未实装的卡
        const displayTime = new Date(it.displayStartAt).getTime();
        return it.id > 120000 && displayTime < currentTime;
    })
    .forEach(it => {
        const filePath = path.join(scriptDirectory, 'out', `${it.id}-${it.name}.txt`); // 写入文件的路径
        characterService.getCharacterDetail(it.id)
            .then(result => {
                const wikiText = characterToWikiText(result, filePath);
                fs.writeFile(filePath, wikiText,'utf-8', err => {});
            })
    });


