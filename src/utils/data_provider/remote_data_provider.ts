import {CharacterService, PosterService} from 'sirius-calculator';
import fs from 'fs';
import {DataProvider} from "./data_provider";

type Key = 'character'| 'poster';

class RemoteDataProvider implements DataProvider {
    readonly characterDetailsPromise: Promise<any[]>;
    readonly posterDetailPromise: Promise<any[]>;

    constructor() {
        const characterService = new CharacterService();
        this.characterDetailsPromise = characterService.getAllCharacterDetails();
        const posterService = new PosterService();
        this.posterDetailPromise = posterService.getAllPosterDetails();
    }

    fetchData(key: Key): Promise<any> {
        if (key === 'character')
            return this.characterDetailsPromise;
        else if (key === 'poster')
            return this.posterDetailPromise;
        else
            return null;
    }

    async downloadToLocalCache() {
        await this.characterDetailsPromise
            .then(result => {
                fs.writeFileSync(__dirname + '/../../cache/all_character.json', JSON.stringify(result, null, 2));
            });

        await this.posterDetailPromise
            .then(result => {
                fs.writeFileSync(__dirname + '/../../cache/all_poster.josn', JSON.stringify(result, null, 2));
            })
        return '写入完成';
    }
}

export {RemoteDataProvider};