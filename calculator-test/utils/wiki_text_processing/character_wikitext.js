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
    Support: "支援系", Amplification: "增幅系", Special: "特殊系", Control: "支配系",
}

// 颜色
const type2Color = {
    Support: "绿", Control: "红", Amplification: "黄", Special: "蓝",
}

// 天狼星
// 凤心菜 • 静香 • 卡特莉娜·格利贝尔 • 新妻八惠 • 柳场潘达 • 流石知冴
// Eden
// 连尺野初魅 • 乌森大黑 • 舍人仁花子 • 万容 • 笔岛时雨
// 银河座
// 千寿历 • 拉莫娜·沃尔芙 • 王雪 • 莉莉亚·库尔特贝 • 与那国绯花里
// 剧团电姬
// 千寿伊吕波 • 白丸美兔 • 阿岐留卡米拉 • 猫足蕾 • 本巢叶羽
const characterInfoArray = [
    {
        id: 101,
        name: "鳳ここな",
        chineseName: "凤心菜",
    },
    {
        id: 102,
        name: "静香",
        chineseName: "静香",
    },
    {
        id: 103,
        name: "カトリナ・グリーベル",
        chineseName: "卡特莉娜·格利贝尔",
    },
    {
        id: 104,
        name: "新妻八恵",
        chineseName: "新妻八惠",
    },
    {
        id: 105,
        name: "柳場ぱんだ",
        chineseName: "柳场潘达"
    },
    {
        id: 106,
        name: "流石知冴",
        chineseName: "流石知冴",
    },
    {
        id: 201,
        name: "連尺野初魅",
        chineseName: "连尺野初魅",
    },
    {
        id: 202,
        name: "烏森大黒",
        chineseName: "乌森大黑",
    },
    {
        id: 203,
        name: "舎人仁花子",
        chineseName: "舍人仁花子"
    },
    {
        id: 204,
        name: "萬容",
        chineseName: "万容",
    },
    {
        id: 205,
        name: "筆島しぐれ",
        chineseName: "笔岛时雨",
    },
    {
        id: 301,
        name: "千寿暦",
        chineseName: "千寿历",
    },
    {
        id: 302,
        name: "ラモーナ・ウォルフ",
        chineseName: "拉莫娜·沃尔芙",
    },
    {
        id: 303,
        name: "王雪",
        chineseName: "王雪",
    },
    {
        id: 304,
        name: "リリヤ・クルトベイ",
        chineseName: "莉莉亚·库尔特贝",
    },
    {
        id: 305,
        name: "与那国緋花里",
        chineseName: "与那国绯花里",
    },
    {
        id: 401,
        name: "千寿いろは",
        chineseName: "千寿伊吕波",
    },
    {
        id: 402,
        name: "白丸美兎",
        chineseName: "白丸美兔",
    },
    {
        id: 403,
        name: "阿岐留カミラ",
        chineseName: "阿岐留卡米拉",
    },
    {
        id: 404,
        name: "猫足蕾",
        chineseName: "猫足蕾",
    },
    {
        id: 405,
        name: "本巣叶羽",
        chineseName: "本巢叶羽",
    },
];


/**
 * 将 sa 条件转化为 wiki 的模板
 *
 * 检测 sa 开花前 和 开花后的需求，如果两个光相等则值表示一个数字，否则表示为 {开花前需求}-{开花后需求} 的格式。
 * 比如 1 1 4 1 和 1 1 3 1 的条件，那么显示为 |绿=1|红=1|黄=4/3|蓝=1
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
        const month = (startDate.getMonth() + 1).toString().padStart(2, '0');
        const day = (startDate.getDate() + 1).toString().padStart(2, '0');
        return `${year}.${month}.${day}`;
    }
}

/**
 * 将 Character 转化为 wiki 文本形式
 *
 * @param {CharacterDetail} character
 */
module.exports.characterToWikiText = (character) => {
    const fileName = `Card ${character.id} 0.png`;
    const name = character.name;
    // const charaName = character.characterBase;
    const charaName = characterInfoArray
        .find(characterInfo => characterInfo.name === character.characterBase)
        .chineseName;
    const rarity = character.rarity[4];
    const fileNameAwaken = rarity === '4'? `Card ${character.id} 1.png` : '';
    const attribute = attribute2wiki[character.attribute];
    const starAct = character.starAct.descriptionChinese;
    const lightType = type2Wiki[character.sense.type];
    const coolTime = character.sense.coolTime.origin.toString() + "/" + character.sense.coolTime.bloom.toString();
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
    const phase5 = _phase5 + (rarity === '4' ? `<br/>SP摄影胶卷【${charaName}】` : '');
    const event = character.event;
    const displayTime = displayDateConvert(character.displayStartAt);


    return `{{卡面信息
|图片=${fileName}
|觉醒后图片=${fileNameAwaken}
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

if (require.main === module) {
    const date = new Date("2024-01-20T08:00:00.000Z");
    console.log(displayDateConvert(date));
}