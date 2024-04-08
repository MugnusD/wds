import {characterBaseInfoArray} from "../characterBaseInfo";

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

interface SenseType {
    type: string,
    extraType: string,
}


/**
 * 将 sa 条件转化为 wiki 的模板
 *
 * 检测 sa 开花前 和 开花后的需求，如果两个光相等则值表示一个数字，否则表示为 {开花前需求}-{开花后需求} 的格式。
 * 比如 1 1 4 1 和 1 1 3 1 的条件，那么显示为 |绿=1|红=1|黄=4/3|蓝=1
 * 对于 0 0 0 2 这种则只写 |绿=|红=|黄=|蓝=2
 */
function saCondition(character: CharacterDetail): string {
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

function getSenseType(characterDetail: CharacterDetail): SenseType {
    const senseTypesArray: string[] = characterDetail.sense.effectTypes;
    const typeMap = {
        // 如果存在 P 条获取，则为 P Gauge 类
        'Principal': characterDetail.sense.acquirableGauge !== 0,
        // 如果存在生命获取，则为生命恢复类
        'Life': senseTypesArray.includes('LifeHealing'),
        // 如果不存在分支效果（仅分数）、且不是 いろは 的无效果，或者如果仅存在一个分支效果、且为额外 P 条，则为分数类
        'Score': (senseTypesArray.length === 0 && characterDetail.sense.type !== 'None')
            || (senseTypesArray.length === 1 && senseTypesArray.includes('PrincipalGaugeGain')),
        // 如果存在 SA Up
        'SAAmplification': senseTypesArray.includes('StarActScoreUp'),
        // 如果存在 SS Up，且不是 静香 的替代技能的 preEffect
        'SSAmplification': senseTypesArray.includes('SenseScoreUp') && !senseTypesArray.includes('SenseAlternative'),
        // 其他
        'Special': true,
    };

    let type: string,
        extraType: string;

    for(const [typeName, condition] of Object.entries(typeMap)) {
        if (condition) {
            type = typeName;
            break;
        }
    }

    if(senseTypesArray.includes('PrincipalGaugeGain')) {
        extraType = 'Principal';
    } else if (senseTypesArray.includes('ScoreUpByHighLife') || senseTypesArray.includes('ScoreUpByLowLife')) {
        extraType = 'LifeScore';
    } else {
        extraType = 'None';
    }

    return {type, extraType};
}

/**
 * 将 Character 转化为 wiki 文本形式
 */
function generateCharacterWikiText(character: CharacterDetail, onlyTemplate: boolean = false): string {
    const fileName = `Card ${character.id} 0.png`;
    const iconFileName = `Icon ${character.id} 0.png`;
    const name = character.name;
    // const charaName = character.characterBase;
    const charaName = characterBaseInfoArray
        .find(characterInfo => characterInfo.name === character.characterBase)
        .chineseName;
    const rarity = character.rarity[4];

    const fileNameAwaken = rarity === '4' ? `|觉醒后图片=Card ${character.id} 1.png` : '';
    const iconFileNameAwaken = rarity === '4' ? `|觉醒后图标=Icon ${character.id} 1.png` : '';

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
    let displayTime: string = new Date(character.displayStartAt).toLocaleDateString('zh-CN');
    if (displayTime === '2022/12/31') {
        displayTime = '2023/7/26';
    }

    // sense 效果分类
    const {type, extraType} = getSenseType(character);

    const wikiText = `{{卡面信息
|图片=${fileName}
${fileNameAwaken}
|图标=${iconFileName}
${iconFileNameAwaken}
|演员名称=${name}
|角色名=${charaName}
|星级=${rarity}
|属性=${attribute}
|技能效果=${sense}
|技能类型=${type}
|追加技能类型=${extraType}
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

    if (onlyTemplate) {
        return wikiText;
    } else {
        // 如果是 1 星卡，特殊处理
        const displayTitle = character.id < 114514 ? `{{DISPLAYTITLE:${character.name}}}\n` : '';
        return displayTitle + wikiText + `
==卡面信息==
===卡面相关===
===卡面简评===
===卡面故事===
{{角色索引}}
[[分类:卡面]]`;
    }
}

export {generateCharacterWikiText};