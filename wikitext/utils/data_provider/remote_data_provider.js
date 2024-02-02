const cal = require('sirius-calculator');
const fs = require("fs");
const DataProvider = require('./data_provider');

class RemoteDataProvider extends DataProvider {
    constructor() {
        super();
    }

    async fetchData() {
        const characterService = new cal.CharacterService();
        return characterService.getAllCharacterDetails();
    }

    async downloadToLocalCache() {
        const characterService = new cal.CharacterService();
        characterService.getAllCharacterDetails()
            .then(result => {
                fs.writeFileSync('../../cache/all_character.json', JSON.stringify(result, null, 2));
            })
    }
}

module.exports = RemoteDataProvider;

if (require.main === module) {
    // 更新缓存
    new RemoteDataProvider().downloadToLocalCache().then();
}