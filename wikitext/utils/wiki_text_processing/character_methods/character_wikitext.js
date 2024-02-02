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
const characterBaseInfoArray = require('./character_base_info');
const fs = require("fs");

// 角色属性
const attribute2wiki = {
    Cute: 1, Cool: 2, Colorful: 3, Cheerful: 4,
}

// 光
const type2Wiki = {
    Support: "支援系", Amplification: "增幅系", Special: "特殊系", Control: "支配系",
}

// 颜色
const type2Color = {
    Support: "绿", Control: "红", Amplification: "黄", Special: "蓝",
}

/**
 * 将 sa 条件转化为 wiki 的模板
 *
 * 检测 sa 开花前 和 开花后的需求，如果两个光相等则值表示一个数字，否则表示为 {开花前需求}-{开花后需求} 的格式。
 * 比如 1 1 4 1 和 1 1 3 1 的条件，那么显示为 |绿=1|红=1|黄=4/3|蓝=1
 * 对于 0 0 0 2 这种则只写 |绿=|红=|黄=|蓝=2
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

            if (origin === 0) {
                return colorPre;
            }

            if (origin === bloom) {
                return colorPre + origin.toString();
            } else {
                return colorPre + origin.toString() + '/' + bloom.toString();
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
        const year = startDate.getFullYear().toString();
        const month = (startDate.getMonth() + 1).toString().padStart(2, '0'); // getMonth 从 0 开始
        const day = (startDate.getDate()).toString().padStart(2, '0'); // getDate 从 1 开始
        return `${year}.${month}.${day}`;
    }
}

/**
 * 将 Character 转化为 wiki 文本形式
 *
 * @param {CharacterDetail} character
 */
function characterToWikiText(character)  {
    const fileName = `Card ${character.id} 0.png`;
    const name = character.name;
    // const charaName = character.characterBase;
    const charaName = characterBaseInfoArray
        .find(characterInfo => characterInfo.name === character.characterBase)
        .chineseName;
    const rarity = character.rarity[4];
    const fileNameAwaken = rarity === '4' ? `Card ${character.id} 1.png` : '';
    const attribute = attribute2wiki[character.attribute];
    const sense = character.sense.descriptionsChinese.join('<br/>');
    const lightType = type2Wiki[character.sense.type] ?? '无';

    const coolTimeInfo = character.sense.coolTime;
    const coolTimeOrigin = coolTimeInfo.origin;
    const coolTimeBloom = coolTimeInfo.bloom;
    const coolTime = coolTimeOrigin === 0 ? '-' :
        coolTimeOrigin === coolTimeBloom ?
            coolTimeOrigin.toString() :
            coolTimeOrigin.toString() + '/' + coolTimeBloom.toString();
    // const coolTime = character.sense.coolTime.origin.toString() + "/" + character.sense.coolTime.bloom.toString();
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

    const [phase1, phase2, phase3, phase4, _phase5] = character.bloomBonuses
        .map(it => {
            return it.descriptionsChinese.join("<br/>");
        })
    let film = '';
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
            film = `<br/>SP摄影胶卷【${charaName}】`;
            break;
    }
    const phase5 = _phase5 + film;
    // const phase5 = _phase5 + (rarity === '4' ? `<br/>SP摄影胶卷【${charaName}】` : '');
    const event = character.event;
    const displayTime = displayDateConvert(new Date(character.displayStartAt));


    return `{{卡面信息
|图片=${fileName}
|觉醒后图片=${fileNameAwaken}
|演员名称=${name}
|角色名=${charaName}
|星级=${rarity}
|属性=${attribute}
|技能效果=${sense}
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
}}
==卡面信息==
===卡面相关===
===卡面简评===
===卡面故事===
====前篇====
====后篇====
{{角色索引}}
`
}

module.exports = characterToWikiText;

if (require.main === module) {
    const fs = require('fs');
    const data = fs.readFileSync(`E:\\html_code\\wds\\wikitext\\cache\\all_character.json`, 'utf-8');
    const objects = JSON.parse(data);
    const kkn = objects.find(_ => _.name === `夢見る少女`);
    console.log(module.exports(kkn));
}
