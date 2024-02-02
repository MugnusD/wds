import {DataProvider} from "./data_provider";
import fs from 'fs';

class LocalDataProvider implements DataProvider {
    fetchData(): Promise<any[]> {
        const data = fs.readFileSync(__dirname + '/../../cache/all_character.json', "utf-8");
        return Promise.resolve(JSON.parse(data));
    }
}

export {LocalDataProvider};
