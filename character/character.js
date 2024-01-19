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
 */

const charaData = fs.readFileSync('master.json', 'utf-8');
/** @type {Character[]} */
const characterArray = JSON.parse(charaData);

const senseData = fs.readFileSync('SenseMaster.json', 'utf-8');
/** @type {Sense[]} */
const senseArray = JSON.parse(senseData);

const id2SenseMap = {};
senseArray.forEach((sense) => {
    id2SenseMap[sense.id] = sense;
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
    Cute: 1,
    Cool: 2,
    Colorful: 3,
    Cheerful: 4,
}

// 光
const type2Wiki = {
    Support: "支援系",
    Amplification: "增强系",
    Special: "特殊系",
    Control: "支配系",
}

/** @param {Character} character */
function wikiTemplate(character) {
    const cardName = character.name;
    const minLevelStatus = character.minLevelStatus;
    const name = id2Name[character.characterBaseMasterId];
    const rarity = character.rarity[4];
    const attribute = attribute2wiki[character.attribute];
    const sense = id2SenseMap[character.senseMasterId];
    const coolDown = sense.coolTime;
    const type = type2Wiki[sense.type];
    const description = sense.description;

    return`{{卡面信息
|图片=
|觉醒后图片=
|演员名称=${cardName}
|角色名=${name}
|星级=${rarity}
|属性=${attribute}
|技能效果=${description}
|光=${type}
|CT=${coolDown}
|歌唱力=${minLevelStatus.vocal}
|表现力=${minLevelStatus.expression}
|集中力=${minLevelStatus.concentration}
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

