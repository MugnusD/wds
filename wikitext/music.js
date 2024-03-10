const fs = require('fs');

const characterBaseData = fs.readFileSync('./cache/characterBase.json', 'utf-8');
const characterBase = JSON.parse(characterBaseData);

const musicData = fs.readFileSync('./cache/music.json', 'utf-8');
const music = JSON.parse(musicData);

const characterMusic = {};

characterBase.forEach(item => {
    characterMusic[item.id] = {
        id: item.id,
        name: item.name,
        count: 0,
        musics: [],
    }
});

music.forEach(item => {
        item.vocalVersions[0].characters.forEach(id => {
            characterMusic[id].count ++;
            characterMusic[id].musics.push(item.name);
        });
});

fs.writeFileSync('./out/json/character_music.json', JSON.stringify(characterMusic, null, 2), 'utf-8');