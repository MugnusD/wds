import {characterBaseInfoArray, CharacterBaseInfoType} from "../characterBaseInfo";

async function generateCharacterStoryText(characterInfo: CharacterDetail): Promise<string> {
    const firstStoryId = characterInfo.episodes.find(_ => _.episodeOrder === 'First').id;
    const secondStoryId = characterInfo.episodes.find(_ => _.episodeOrder === 'Second').id;

    return `
{| class="wikitable mw-collapsible mw-collapsed"
! 前篇 !! 后篇
|-
|style="vertical-align: top;" |${await getStoryText(firstStoryId)}
|style="vertical-align: top;" |${await getStoryText(secondStoryId)}
|}`;
}

type StoryLine = {
    groupOrder: number,
    phrase: string,
    speakerIconId: string,
    speakerName: string,
}

/**
 * 输入剧情 id，返回处理过的文本
 * @param {number} id
 * @returns {string}
 */
async function getStoryText(id: number): Promise<string> {
    // const dir = 'E:\\html_code\\src\\story';
    // const storyData = fs.readFileSync(path.join(dir, id + '.json'), 'utf-8');
    // const storyLines: StoryLine[] = JSON.parse(storyData);

    const response = await fetch(`https://sirius.3-3.dev/scene/${id}.json`);
    const storyLines: StoryLine[] = await response.json();

    // 将同样 GroupLines 的对话对象合并到一个数组中
    const groupLines = storyLines.reduce<StoryLine[][]>((acc, line) => {
        const groupOrder = line.groupOrder - 1;
        if (!acc[groupOrder]) {
            acc[groupOrder] = [];
        }
        acc[groupOrder].push(line);
        return acc;
    }, []);

    const lines = groupLines
        .map(groupLines => {
            let phrase: string;
            // 如果这个对话数组不止一个对象，那么把所有的 phrase 都合并在一起。如果只有一个对象，那么这个 phrase 就是新的属性值（避免使用
            // reduce 产生错误）。
            if (groupLines[1]) {
                phrase = groupLines.reduce((acc, line, index) => acc + (index === 0 ? '' : '<br />') + line.phrase, '');
            } else {
                phrase = groupLines[0].phrase;
            }
            // 替换 phase 中的 /n 为 <br />
            phrase = phrase.replace('/n', '<br />');

            return {
                phrase: phrase,
                speakerIconId: groupLines[0].speakerIconId,
                speakerName: groupLines[0].speakerName,
            };
        })
        // 去除只有声音、没有文本的语句
        .filter(line =>
            line.phrase !== '',
        )
        // 给名字加上颜色
        .map(line => {
             const chara: CharacterBaseInfoType = characterBaseInfoArray.find(_ => line.speakerName === _.firstName);

            let speaker: string;
            if (chara) {
                speaker = chara.styledName.replace('{name}', line.speakerName);
            } else if (line.speakerName === undefined) {
                speaker = '';
            } else if (line.speakerName.includes('・')) {
                speaker = line.speakerName;
                characterBaseInfoArray.forEach(characterBaseInfo => {
                    speaker = speaker.replace(characterBaseInfo.firstName, characterBaseInfo.styledName.replace('{name}', characterBaseInfo.firstName));
                });
            } else {
                speaker = '<span style="color: gray;font-weight: bold;text-shadow: 1px 1px 0 #888">{name}</span>'.replace('{name}', line.speakerName);
            }

            const phrase = line.phrase;

            return (speaker === '' ? '' : speaker + '<br />') + phrase;
        });

    return lines.join('<br /><br />');
}

export {generateCharacterStoryText, getStoryText};