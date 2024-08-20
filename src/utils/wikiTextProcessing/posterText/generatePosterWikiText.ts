import {posterLeaderAbilityTypeMap, posterNormalAbilityTypeMap} from './posterAbilityTypeMap';
import {descriptionToType} from "../descriptionToType";
import {characterBaseInfoArray} from "../characterBaseInfo";
import convertUnityDescriptionToHtml from "../unityToHtml/convertUnityDescriptionToHtml";

function generatePosterWikiText(poster: PosterDetail): string {
    const posterImageFileName = `Poster ${poster.id} 0.png`;
    const posterName = poster.name;
    const rarity = poster.rarity;

    // 有些海报不存在出场角色，疑似 KMS 忘记填了
    const appearanceCharacter =
              poster.appearanceCharacterBasesChinese.length !== 0 ?
                  poster.appearanceCharacterBasesChinese
                      .reduce(((previousValue, currentValue) => {
                          return previousValue + ',' + currentValue;
                      })) :
                  '';

    const leaderAbilities = poster.abilities.filter(_ => _.type === 'Leader');
    let leaderAbilityText: string;

    let leaderAbilityType: string = '';

    if (leaderAbilities.length === 1) {
        const leaderAbility = leaderAbilities[0];

        // 技能描述
        leaderAbilityText = `|队长技能=` + leaderAbility.name + ':<br />'
            + convertUnityDescriptionToHtml(leaderAbility.descriptionChinese);

        // 技能类型
        leaderAbilityType = descriptionToType(leaderAbility.descriptionChinese, posterLeaderAbilityTypeMap);
    } else {
        const leaderAbilityTextArray: string[] = [];
        const leaderAbilityTypes: string[] = [];

        for (const leaderAbility of leaderAbilities) {
            // 技能描述
            let index = leaderAbilities.indexOf(leaderAbility) + 1;
            const leaderAbilityText = `|队长技能` + index.toString() + '=' + leaderAbility.name + ':<br />'
                + convertUnityDescriptionToHtml(leaderAbility.descriptionChinese);
            leaderAbilityTextArray.push(leaderAbilityText);

            // 技能类型
            leaderAbilityTypes.push(descriptionToType(leaderAbility.descriptionChinese, posterLeaderAbilityTypeMap));
        }

        leaderAbilityText = `|队长技能数=${leaderAbilities.length}\n` + leaderAbilityTextArray.join('\n');
        leaderAbilityType = leaderAbilityTypes.join(',');
    }


    const normalAbilities = poster.abilities.filter(_ => _.type === 'Normal');
    const abilityCount = normalAbilities.length;
    const normalAbilityTexts: string[] = [];
    const normalAbilityTypes: string[] = [];
    const normalAbilityNames: string[] = [];

    let i = 1;
    for (let normalAbility of normalAbilities) {
        const normalAbilityText = `|技能` + i.toString() + '=' + normalAbility.name + ':<br />'
            + convertUnityDescriptionToHtml(normalAbility.descriptionChinese)
            + (normalAbility.releaseLevelAt === 0 ? '' : `<br />（技能于${normalAbility.releaseLevelAt}级解锁）`);
        normalAbilityTexts.push(normalAbilityText);
        i++;

        normalAbilityTypes.push(descriptionToType(normalAbility.descriptionChinese, posterNormalAbilityTypeMap));
        normalAbilityNames.push(normalAbility.name);
    }
    i = null;

    const event = poster.event;

    let displayTime = new Date(poster.displayStartAt).toLocaleDateString('zh-CN');
    if (displayTime === '2022/12/31') {
        displayTime = '2023/7/26';
    }

    // Story
    let info: PosterStory,
        ch1: PosterStory,
        ch2: PosterStory,
        ch3: PosterStory,
        ch4: PosterStory,
        after: PosterStory[],
        afterStory: string;

    if (poster.stories.length !== 0) {
        [info, ch1, ch2, ch3, ch4, ...after] = poster.stories;
        afterStory = after.reduce((prev, posterStory, currentIndex) => {
            let line = '';
            const character = characterBaseInfoArray.find(_ => _.id === posterStory.characterBaseMasterId);

            line += character.styledName.replace(/{name}/, character.chineseName);
            line += '<br />';
            line += posterStory.description.replace(/\/n/, '<br />');

            return prev + (currentIndex !== 0 ? '<br /><br />': '') + line;
        }, '');
    }

    const infoBox = `{{CSS|Infobox}}
{{海报信息
|图片=${posterImageFileName}
|海报名称=${posterName}
|稀有度=${rarity}
|出镜角色=${appearanceCharacter}
${leaderAbilityText}
|队长技能效果类型=${leaderAbilityType}
|技能数=${abilityCount}
${normalAbilityTexts.join('\n')}
|技能效果=${normalAbilityNames.join('<br />')}
|技能效果类型=${normalAbilityTypes.join(',')}
|隶属活动=${event}
|登场时间=${displayTime}
}}
` ;

    const story = poster.stories.length !== 0 ? `{{海报剧情
|情报=${info.description.replace(/\/n/g, '<br />')}
|第一幕=${ch1.description.replace(/\/n/g, '<br />')}
|第二幕=${ch2.description.replace(/\/n/g, '<br />')}
|第三幕=${ch3.description.replace(/\/n/g, '<br />')}
|第四幕=${ch4.description.replace(/\/n/g, '<br />')}
|后日谈=${afterStory}
}}` : ''

    return infoBox + story;
}

export {generatePosterWikiText};