// 该脚本获取角色信息，然后输出为可用的文本。
// 应该作为 wikiClient 的一个包装，待修改。
const cal = require('sirius-calculator');
const fs = require('fs');
const path = require('path');
const {characterToWikiText} = require('./utils/wiki_text_processing/character_methods/character_wikitext.js');

const currentTime = Date.now();
const characterService = new cal.CharacterService();
const scriptDirectory = __dirname;

characterService.getAllCharacterDetails()
    .then(allCharacters => {
        const charactersWikiArray = allCharacters
            // 筛选掉开头的非角色卡、排除还未实装的卡
            .filter(character => {
            const displayTime = new Date(character.displayStartAt).getTime();
            return character.id > 114514 && displayTime < currentTime;
        })
            .map(character => ({
                name: character.name,
                text: characterToWikiText(character),
            }))

        const outputPath = path.join(scriptDirectory, 'out', 'json', `allCharacter.json`);
        const jsonString = JSON.stringify(charactersWikiArray, null, 2);

        fs.writeFileSync(outputPath, jsonString, 'utf-8');

            // .forEach(character => {
            //     const filePath = path.join(scriptDirectory, 'out', 'json', `${character.id}-${character.name}.json`);
            //     const wikiText = characterToWikiText(character);
            //     const jsonObject = {
            //         name: character.name,
            //         text: wikiText,
            //     }
            //     fs.writeFile(filePath, JSON.stringify(jsonObject, null, 2), 'utf-8', () => {});
            // })
    });



