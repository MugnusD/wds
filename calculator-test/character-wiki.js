const cal = require('sirius-calculator');
const fs = require('fs');
const path = require('path');
const {characterToWikiText} = require('./utils/wiki_text_processing/character_wikitext');

// CharacterMaster.json 读取
// const charaData = fs.readFileSync('CharacterMaster.json', 'utf-8');
// const characterArray = JSON.parse(charaData);

const currentTime = Date.now();
const characterService = new cal.CharacterService();
const scriptDirectory = __dirname;

// const testData = fs.readFileSync( scriptDirectory + "/cache/kkn.json", 'utf-8');
// const testCharacter = JSON.parse(testData);
// console.log(characterToWikiText(testCharacter));

characterService.getAllCharacterDetails()
    .then(allCharacters => {
        allCharacters
            // 筛选掉开头的非角色卡、排除还未实装的卡
            .filter(character => {
            const displayTime = new Date(character.displayStartAt).getTime();
            return character.id > 114514 && displayTime < currentTime;
        })
            .forEach(character => {
                const filePath = path.join(scriptDirectory, 'out', `${character.id}-${character.name}.txt`);
                const wikiText = characterToWikiText(character);
                fs.writeFile(filePath, wikiText, 'utf-8', () => {});
            })
    });

// characterArray
//     .filter(it => {
//         const displayTime = new Date(it.displayStartAt).getTime();
//         return it.id > 120000 && displayTime < currentTime;
//     })
//     .forEach(it => {
//         const filePath = path.join(scriptDirectory, 'out', `${it.id}-${it.name}.txt`);
//         characterService.getCharacterDetail(it.id)
//             .then(result => {
//                 const wikiText = characterToWikiText(result);
//                 fs.writeFile(filePath, wikiText,'utf-8', err => {});
//             })
//     });


