// 该脚本上传 wiki 文本，应该作为包装的一部分，待修改。

const WikiClient = require('./utils/http/wikiClient');
const fs = require("fs");
const {generateCharacterStoryText} = require('./utils/wiki_text_processing/character_methods/story_wikitext');

const sessData = '6b7b18e8%2C1721491941%2C2fbe1%2A11CjAf0tEwI5uvWxy3rQERNXmuVL2ZkUkL1Eo7wxPycgo-qsSRE19_WV7tD-lfyidPAoISVk9BODE5VmE1TjIxTkpIaWJQeTdqYkk4SEEwRUZ3eHc0d3ItM3ItOURmdnlNb3BaZGRpSlJNRElSY1lFX1NyVVp1b25sWVhOMVVVX19tSDRndm5WN2tBIIEC';
const biliWiki = 'https://wiki.biligame.com/worlddaistar/api.php';

function uploadAllCharacter() {
    const wc = new WikiClient(sessData);
    const charactersInfoArrayData = fs.readFileSync('./out/json/allCharacter.json', 'utf-8');
    const charactersInfoArray = JSON.parse(charactersInfoArrayData);
    const currentTime = Date.now();

    charactersInfoArray
        .filter(characterInfo => characterInfo.name !== '悲哀と恋慕の旋律') // 暂时不动初始 kkn
        .forEach(characterInfo => {
            const pageTitle = characterInfo.name;
            const text = characterInfo.text;

            wc.editPage(pageTitle, text)
                .then(console.log)
        });
}

function uploadCharacterStory() {
    const wc = new WikiClient(sessData);
    // 读取缓存，之后修改
    const characterData = fs.readFileSync('./cache/all_character.json', 'utf-8');
    const characterInfos = JSON.parse(characterData);

    characterInfos.forEach(characterInfo => {
        const wikiText = generateCharacterStoryText(characterInfo);
        wc.editPage(characterInfo.name, wikiText, 4, true)
            .then(console.log);
    })
}

uploadCharacterStory();
