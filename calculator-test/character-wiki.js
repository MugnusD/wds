const cal = require('sirius-calculator');
const fs = require('fs');
const path = require('path');
const {CharacterService} = require("sirius-calculator");

/**
 * @typedef {Object} CharacterDetail
 * @property {number} id - 卡牌 id，唯一标识符
 * @property {string} name - 卡牌名字
 * @property {string} rarity - 稀有度，如 Rare2
 * @property {string} attribute - 卡牌属性
 * @property {StatusInfo[]} status - 角色三围
 * @property {Object} characterBase - 所基于的角色信息
 * @property {StarActInfo} starAct - 卡牌 SA 信息
 * @property {SenseInfo} sense - 卡牌 sense 信息
 * @property {BloomBonusInfo[]} bloomBonuses - 开花阶段奖励
 * @property {date} displayStartAt - 实装时间
 * @property {date} event - 实装活动
 * @property {string} gacha - 实装卡池
 */

/**
 * @typedef {Object} StatusInfo
 * @property {Object} preset - 级别设置
 * @property {Object} status - 具体三围
 * @property {number} status.vocal - 歌唱力
 * @property {number} status.expression - 演唱力
 * @property {number} status.concentration - 集中力
 */

/**
 * @typedef {Object} StarActInfo
 * @property {string} description - Star Act 的描述
 * @property {string} descriptionChinese - Star Act 的中文描述
 * @property {ConditionInfo[]} conditions - SA 发动条件
 *
 * @typedef {Object} ConditionInfo
 * @typedef {string} type - 条件类型，比如 Support
 * @typedef {string} typeChinese - 条件中文名，比如 支援系
 * @typedef {number} origin - 原本需要的个数
 * @typedef {number} bloom - 开花后需要个个数
 */

/**
 * @typedef {Object} SenseInfo
 * @property {string[]} descriptions - Sense 技能的描述信息。
 * @property {string[]} descriptionsChinese - Sense 技能的中文描述信息。
 * @property {string} type - Sense 技能的类型,比如 Support。
 * @property {number} lightCount - Sense 基于的光个数，基本都是 1。
 * @property {Object} coolTime - Sense 技能的冷却时间。
 * @property {number} coolTime.origin - 本来的持续时间
 * @property {number} coolTime.bloom - 开花后的持续时间
 */

/**
 * @typedef {Object} BloomBonusInfo
 * @property {number} phase - Bloom 阶段的编号。
 * @property {string[]} descriptions - Bloom 阶段的奖励描述信息。
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
    Support: "绿", Control: "红", Amplification: "黄", Special: "蓝",
}

/**
 * 将 sa 条件转化为 wiki 的模板
 *
 * 检测 sa 开花前 和 开花后的需求，如果两个光相等则值表示一个数字，否则表示为 {开花前需求}-{开花后需求} 的格式。
 * 比如 1 1 4 1 和 1 1 3 1 的条件，那么显示为 |绿=1|红=1|黄=4-3|蓝=1
 *
 * @param character
 * @returns {string}
 */
function saCondition(character) {
    const lightTypes = ["Support", "Control", "Amplification", "Special"];

    return lightTypes
        .map(lightType => {
            const lightCondition = character.starAct.conditions.find(it => it.type === lightType);
            const origin = lightCondition.origin;
            const bloom = lightCondition.bloom;
            const colorPre = "|" + type2Color[lightType] + "=";

            if (origin === bloom) {
                return colorPre + origin.toString();
            } else {
                return colorPre + origin.toString() + "-" + bloom.toString();
            }
        })
        .join('');
}

const initialTime = new Date('2022-12-31T15:00:00.000Z').getTime();
/**
 * 解释 ISO 日期字符串，然后转化为诸如 2000.1.1 的字符串形式。如果是 2022-12-31T15:00:00.000Z 则转化为开服日期。
 *
 * @param {Date} startDate - ISO 日期字符串
 * @returns {string} - 返回字符串
 */
function displayDateConvert(startDate) {
    if (startDate.getTime() === initialTime) {
        return "2023.07.26";
    } else {
        const date = new Date(startDate);
        return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${(date.getDay() + 1).toString().padStart(2, '0')}`
    }
}

/**
 * 服务于最后角色信息期约的 then 处理程序
 *
 * @param {CharacterDetail} character 接受期约的 result/value
 */
function characterToWikiText(character) {
    const name = character.name;
    const charaName = character.characterBase;
    const rarity = character.rarity[4];
    const attribute = attribute2wiki[character.attribute];
    const starAct = character.starAct.descriptionChinese;
    const lightType = type2Wiki[character.sense.type];
    const coolTime = character.sense.coolTime.origin.toString() + "-" + character.sense.coolTime.bloom.toString();
    const condition = saCondition(character);
    const saDescription = character.starAct.descriptionChinese;

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
|Star Act=${saDescription}
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
// const charaData = fs.readFileSync('CharacterMaster.json', 'utf-8');
// const characterArray = JSON.parse(charaData);
const currentTime = Date.now();

const characterService = new cal.CharacterService();
const scriptDirectory = __dirname;

// const testData = fs.readFileSync( scriptDirectory + "/cache/kkn.json", 'utf-8');
// const testCharacter = JSON.parse(testData);
// console.log(characterToWikiText(testCharacter));

characterService.getAllCharacterDetails()
    .then(allCharacters => {
        allCharacters
            // 筛选掉开头的非角色卡、排除还未实装的卡
            .filter(character => {
            const displayTime = new Date(character.displayStartAt).getTime();
            return character.id > 114514 && displayTime < currentTime;
        })
            .forEach(character => {
                const filePath = path.join(scriptDirectory, 'out', `${character.id}-${character.name}.txt`);
                const wikiText = characterToWikiText(character);
                fs.writeFile(filePath, wikiText, 'utf-8', () => {});
            })
    });

// characterArray
//     .filter(it => {
//         const displayTime = new Date(it.displayStartAt).getTime();
//         return it.id > 120000 && displayTime < currentTime;
//     })
//     .forEach(it => {
//         const filePath = path.join(scriptDirectory, 'out', `${it.id}-${it.name}.txt`);
//         characterService.getCharacterDetail(it.id)
//             .then(result => {
//                 const wikiText = characterToWikiText(result);
//                 fs.writeFile(filePath, wikiText,'utf-8', err => {});
//             })
//     });

