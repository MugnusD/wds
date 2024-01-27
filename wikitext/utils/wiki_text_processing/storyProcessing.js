const characterStyles = [
    {
        id: 101,
        name: 'ここな',
        styledName: '<span style="color: #F07B7C;font-weight: bold;">{name}</span>'},
    {
        id: 102,
        name: '静香',
        styledName: '<span style="color: #6F93E7;font-weight: bold;">{name}</span>'
    },
    {
        id: 103,
        name: 'カトリナ・グリーベル',
        styledName: '<span style="color: #FFB83C;font-weight: bold;">{name}</span>'
    },
    {
        id: 104,
        name: '柳場ぱんだ',
        styledName: '<span style="color: #70DCF3;font-weight: bold;">{name}</span>'
    },
    {
        id: 105,
        name: '流石知冴',
        styledName: '<span style="color: #F3AF9C;font-weight: bold;">{name}</span>'
    },
    {
        id: 106,
        name: '新妻八恵',
        styledName: '<span style="color: #C7BEF6;font-weight: bold;">{name}</span>'
    },
    {
        id: 301,
        name: '千寿暦',
        styledName: '<span style="color: #4E5BA8;font-weight: bold;">{name}</span>'
    },
    {
        id: 302,
        name: 'ラモーナ・ウォルフ',
        styledName: '<span style="color: #FF9B5E;font-weight: bold;">{name}</span>'
    },
    {
        id: 303,
        name: '王雪',
        styledName: '<span style="color: #F05A5A;font-weight: bold;">{name}</span>'},
    {
        id: 304,
        name: 'リリヤ・クルトベイ',
        styledName: '<span style="color: #83D3D6;font-weight: bold;">リリヤ・クルトベイ</span>'
    },
    {
        id: 305,
        name: '与那国 緋花里',
        styledName: '<span style="color: #E8557E;font-weight: bold;">{name}</span>'
    },
    {
        id: 401,
        name: '千寿 いろは',
        styledName: '<span style="color: #BAC4D7;font-weight: bold;">{name}</span>'
    },
    {
        id: 402,
        name: '白丸美兎',
        styledName: '<span style="color: #FFA866;font-weight: bold;">{name}</span>'
    },
    {
        id: 403,
        name: '阿岐留 カミラ',
        styledName: '<span style="color: #C0F297;font-weight: bold;">{name}</span>'
    },
    {
        id: 404,
        name: '猫足蕾',
        styledName: '<span style="color: #AE7AD4;font-weight: bold;">{name}</span>'},
    {
        id: 405,
        name: '本巣叶羽',
        styledName: '<span style="color: #FF92B1;font-weight: bold;">{name}</span>'
    },
    {
        id: 201,
        name: '連尺野初魅',
        styledName: '<span style="color: #998EDD;font-weight: bold;">{name}</span>'
    },
    {
        id: 202,
        name: '烏森大黒',
        styledName: '<span style="color: #505053;font-weight: bold;">{name}</span>'
    },
    {
        id: 203,
        name: '舎人仁花子',
        styledName: '<span style="color: #4195DD;font-weight: bold;">{name}</span>'
    },
    {
        id: 204,
        name: '萬容',
        styledName: '<span style="color: #B59158;font-weight: bold;">{name}</span>'},
    {
        id: 205,
        name: '筆島しぐれ',
        styledName: '<span style="color: #B5303C;font-weight: bold;">{name}</span>'
    },
];

const fs = require('fs');
const path = require('path');

module.exports.generateCharacterStoryText = (characterInfo) => {
    const firstStoryId = characterInfo.episodes.find(_ => _.episodeOrder === 'First').id;
    const secondStoryId = characterInfo.episodes.find(_ => _.episodeOrder === 'Second').id;

    return `===卡面故事===
{| class="wikitable mw-collapsible mw-collapsed"
! 前篇 !! 后篇
|-
|${getStoryText(firstStoryId)}
|${getStoryText(secondStoryId)}
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
            let phrase = '';
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
        // 给名字加上颜色
        .map(line => {
            const chara = characterStyles.find(character => character.id.toString() === line.speakerIconId);

            let speaker = '';
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


if (require.main === module) {
   console.log('ああ、ありがとうね。/n劇で忙しいんだから、手伝ってくれなくても大丈夫だよ。'.replace('/n', '<br />'))

}

