const fs = require('fs');

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
 *
 *
 * @typedef {Object} Sense
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {string} type
 * @property {Array} preEffects
 * @property {Array} branches
 * @property {number} acquirableGauge
 * @property {number} acquirableScorePercent
 * @property {number} scoreUpPerLevel
 * @property {number} lightCount
 * @property {number} coolTime
 * @property {string} branchCondition1
 * @property {null|any} conditionValue1
 * @property {string} branchCondition2
 * @property {null|any} conditionValue2
 *
 *
 *
 * @typedef {Object} Effect
 * @property {number} id
 * @property {string} type
 * @property {string} range
 * @property {string} calculationType
 * @property {Array<{ level: number, value: number }>} details
 * @property {Array} conditions
 * @property {number} durationSecond
 * @property {Array} triggers
 * @property {string} fireTimingType
 *
 *
 * @typedef {Object} StarAct
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {number} starActConditionMasterId
 * @property {number} acquirableScorePercent
 * @property {number} scoreUpPerLevel
 * @property {Array} preEffects
 * @property {Array} branches
 * @property {string} branchCondition1
 * @property {string} branchCondition2
 *
 *
 * @typedef {Object} StarActCondition
 * @property {number} id - The identifier for the light configuration.
 * @property {number} freeLight - The amount of free light.
 * @property {number} supportLight - The amount of support light.
 * @property {number} controlLight - The amount of control light.
 * @property {number} amplificationLight - The amount of amplification light.
 * @property {number} specialLight - The amount of special light.
 */


// CharacterMaster.json 读取
const charaData = fs.readFileSync('master.json', 'utf-8');
/** @type {Character[]} */
const characterArray = JSON.parse(charaData);

// SenseMaster.json 读取
const senseData = fs.readFileSync('SenseMaster.json', 'utf-8');
/** @type {Sense[]} */
const senseArray = JSON.parse(senseData);
// 优化 Array 成 Map
const id2SenseMap = {};
senseArray.forEach((sense) => {
    id2SenseMap[sense.id] = sense;
});

// EffectMaster.json 读取
const effectDate = fs.readFileSync('EffectMaster.json', 'utf-8');
/** @type {Effect[]} */
const effectArray = JSON.parse(effectDate);
const id2EffectMap = {};
effectArray.forEach((effect) => {
    id2EffectMap[effect.id] = effect;
});

// starAct.json 读取
const starActDate = fs.readFileSync('starAct.json', 'utf-8');
/** @type {StarAct[]} */
const starActArray = JSON.parse(starActDate);
const id2StarAct = {};
starActArray.forEach((starAct) =>{
    id2StarAct[starAct.id] = starAct;
});

// starActCondition 读取
const starActConditionDate = fs.readFileSync('starActCondition.json', 'utf-8');
/** @type {StarActCondition[]} */
const starActConditionArray = JSON.parse(starActConditionDate);
const id2StarActCondition = {};
starActConditionArray.forEach((starActCondition) => {
    id2StarActCondition[starActCondition.id] = starActCondition;
})


// 角色 id 到 名字
const id2Name = {
    101: "鳳 ここな",
    102: "静香",
    103: "カトリナ・グリーベル",
    104: "新妻 八恵",
    105: "柳場 ぱんだ",
    106: "流石 知冴",
    201: "連尺野 初魅",
    202: "烏森 大黒",
    203: "舎人 仁花子",
    204: "萬 容",
    205: "筆島 しぐれ",
    301: "千寿 暦",
    302: "ラモーナ・ウォルフ",
    303: "王 雪",
    304: "リリヤ・クルトベイ",
    305: "与那国 緋花里",
    401: "千寿 いろは",
    402: "白丸 美兎",
    403: "阿岐留 カミラ",
    404: "猫足 蕾",
    405: "本巣 叶羽",
}

// 角色属性
const attribute2wiki = {
    Cute: 1, Cool: 2, Colorful: 3, Cheerful: 4,
}

// 光
const type2Wiki = {
    Support: "支援系", Amplification: "增强系", Special: "特殊系", Control: "支配系",
}

function displayDateConvert(startDate) {
    if (startDate === "2023-01-01T00:00:00") {
        return "2023.07.26";
    } else {
        const date = new Date(startDate);
        return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${(date.getDay() + 1).toString().padStart(2, '0')}`
    }
}

/** @param {Character} character */
function wikiTemplate(character) {
    const cardName = character.name; // 卡牌名
    const minLevelStatus = character.minLevelStatus; // 一级属性
    const name = id2Name[character.characterBaseMasterId]; // 角色名，比如 101 是 kkn
    const rarity = character.rarity[4]; // 稀有度，Rare4 是 四星
    const attribute = attribute2wiki[character.attribute]; // 属性，比如彩

    const sense = id2SenseMap[character.senseMasterId]; // 提取 SenseMaster 的 sense 信息，把 json 的 Array 预处理成了 Map 以优化时间复杂度
    const coolDown = sense.coolTime; // 技能 cd
    const type = type2Wiki[sense.type] ?? '无'; // 技能光的颜色
    const description = sense.description; // 技能描述

    const starAct = id2StarAct[character.starActMasterId]; // sa

    const starActCondition = id2StarActCondition[starAct.starActConditionMasterId]; // sa 光的条件
    const green = starActCondition.supportLight;
    const red = starActCondition.controlLight;
    const yellow = starActCondition.amplificationLight;
    const blue = starActCondition.specialLight;

    const displayDateString = displayDateConvert(character.displayStartAt);


    return `{{卡面信息
|图片=
|觉醒后图片=
|演员名称=${cardName}
|角色名=${name}
|星级=${rarity}
|属性=${attribute}
|技能效果=${description}
|光=${type}
|CT=${coolDown}
|绿=${green}|红=${red}|黄=${yellow}|蓝=${blue}
|歌唱力=${minLevelStatus.vocal}
|表现力=${minLevelStatus.expression}
|集中力=${minLevelStatus.concentration}
|演技力=${minLevelStatus.vocal + minLevelStatus.expression + minLevelStatus.concentration}
|四花效果=
|隶属活动
|登场时间=${displayDateString}
}}
`;
}

const outputFolder = 'output';
if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
}

characterArray.forEach((character) => {
    const cardName = character.name;
    const formattedText = wikiTemplate(character);

    const fileName = `${cardName}.txt`;
    fs.writeFileSync(`./${outputFolder}/${fileName}`, formattedText, 'utf-8');
})

console.log('文档已生成成功！');

