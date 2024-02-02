import {CharacterService} from 'sirius-calculator';
import fs from 'fs';
import {DataProvider} from "./data_provider";

class RemoteDataProvider implements DataProvider {
    readonly characterDetailsPromise: Promise<any[]>;

    constructor() {
        const characterService = new CharacterService();
        this.characterDetailsPromise = characterService.getAllCharacterDetails();
    }

    fetchData(): Promise<any> {
        return this.characterDetailsPromise;
    }

    downloadToLocalCache(): void {
        this.characterDetailsPromise
            .then(result => {
                fs.writeFileSync(__dirname + '/../../cache/all_character.json', JSON.stringify(result, null, 2));
                console.log('写入成功');
            })
    }
}

export {RemoteDataProvider};