const fs = require('fs');
const path = require('path');
const characterBaseInfoArray = require('./character_base_info');

function generateCharacterStoryText(characterInfo) {
    const firstStoryId = characterInfo.episodes.find(_ => _.episodeOrder === 'First').id;
    const secondStoryId = characterInfo.episodes.find(_ => _.episodeOrder === 'Second').id;

    return `===卡面故事===
{| class="wikitable mw-collapsible mw-collapsed"
! 前篇 !! 后篇
|-
|style="vertical-align: top;" |${getStoryText(firstStoryId)}
|style="vertical-align: top;" |${getStoryText(secondStoryId)}
|}
{{角色索引}}`
}

/**
 * 输入剧情 id，返回处理过的文本
 * @param {number} id
 * @returns {string}
 */
function getStoryText(id) {
    const dir = 'E:\\html_code\\src\\story';
    const storyData = fs.readFileSync(path.join(dir, id + '.json'), 'utf-8');
    const storyLines = JSON.parse(storyData);

    // 将同样 GroupLines 的对话对象合并到一个数组中
    const groupLines = storyLines.reduce((acc, line) => {
        const groupOrder = line.groupOrder - 1;
        if (!acc[groupOrder]) {
            acc[groupOrder] = [];
        }
        acc[groupOrder].push(line);
        return acc;
    }, []);

    const lines = groupLines
        .map(groupLines => {
            let phrase;
            // 如果这个对话数组不止一个对象，那么把所有的 phrase 都合并在一起。如果只有一个对象，那么这个 phrase 就是新的属性值（避免使用
            // reduce 产生错误）。
            if (groupLines[1]) {
                phrase = groupLines.reduce((acc, line) => acc.phrase + '<br />' + line.phrase);
            } else {
                phrase = groupLines[0].phrase;
            }
            // 替换 phase 中的 /n 为 <br />
            phrase = phrase.replace('/n','<br />');

            return {
                phrase: phrase,
                speakerIconId: groupLines[0].speakerIconId,
                speakerName: groupLines[0].speakerName,
            }
        })
        .filter(line =>
            line.speakerIconId !== undefined
        )
        // 给名字加上颜色
        .map(line => {
            const chara = characterBaseInfoArray.find(character => character.id.toString() === line.speakerIconId);

            let speaker;
            if (chara) {
                speaker = chara.styledName.replace('{name}', line.speakerName);
            } else {
                speaker = '<span style="color: gray;font-weight: bold;">{name}</span>'.replace('{name}', line.speakerName);
            }

            const phrase = line.phrase;

            return speaker + '<br />' + phrase;
        });

    return lines.join('<br /><br />');
}

module.exports = generateCharacterStoryText;

if (require.main === module) {
   const fs = require('fs');
   const data = fs.readFileSync(`E:\\html_code\\wds\\wikitext\\cache\\all_character.json`, 'utf-8');
   const objects = JSON.parse(data);
   const kkn = objects.find(_ => _.name === `夢見る少女`);
   console.log(generateCharacterStoryText(kkn));
}

