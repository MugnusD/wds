import {LocalDataProvider} from "../../../../src/utils/data_provider/local_data_provider";

describe('LocalDataProvider test', () => {
    it('should load local file successfully', () => {
        const localDataProvider = new LocalDataProvider();
        localDataProvider.fetchData()
            .then(characterInfos => {
                characterInfos.forEach(character => {
                    const raritySuf = character.rarity[4] === '4' ? 1 : 0;
                    const txt = `{{卡面单元|Icon ${character.id} ${raritySuf}.png|${character.name}}}`;
                    console.log(txt);
                })
            });
    })
})