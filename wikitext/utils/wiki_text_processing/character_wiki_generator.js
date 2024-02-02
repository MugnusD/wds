const generateCharacterStoryText = require("./character_methods/story_wikitext.js");
const characterToWikiText = require('./character_methods/character_wikitext.js');

function getCharacterTemplate(characterInfo) {
    return characterToWikiText(characterInfo);
}

function getStoryText(characterInfo) {
    return generateCharacterStoryText(characterInfo);
}

module.exports = {
    getCharacterTemplate,
    getStoryText
};

// 如果需要在命令行直接运行该模块
if (require.main === module) {
    const fs = require('fs');
    const data = fs.readFileSync(`E:\\html_code\\wds\\wikitext\\cache\\all_character.json`, 'utf-8');
    const objects = JSON.parse(data);
    const kkn = objects.find(_ => _.name === `夢見る少女`);
    console.log(getStoryText(kkn));
    console.log(getCharacterTemplate(kkn));
}
