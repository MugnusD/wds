const DataProvider = require("./data_provider.js");
const fs = require("fs");

class LocalDataProvider extends DataProvider {
    constructor() {
        super();
    }

    async fetchData() {
        const data = fs.readFileSync('../../cache/all_character.json', "utf-8");
        return JSON.parse(data);
    }
}

module.exports = LocalDataProvider;

if (require.main === module) {
    const localDataProvider = new LocalDataProvider();
    localDataProvider.fetchData()
        .then(characterInfos => {
            characterInfos.forEach(character => {
                const raritySuf = character.rarity[4] === '4' ? 1 : 0;
                const txt = `{{卡面单元|Icon ${character.id} ${raritySuf}.png|${character.name}}}`;
                console.log(txt);
            })
        });
}