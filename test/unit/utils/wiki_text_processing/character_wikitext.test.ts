import {LocalDataProvider} from "../../../../src/utils/data_provider/local_data_provider";
import {generateCharacterWikiText} from "../../../../src/utils/wiki_text_processing/generate_character_wt";
import {generateCharacterStoryText} from "../../../../src/utils/wiki_text_processing/generate_character_story_wt.js";


describe('WikiText test', () => {
    it('should generate a wiki text template', async () => {
        const characterDataProvider = new LocalDataProvider();
        const characterDetails = await characterDataProvider.fetchData();
        const kkn = characterDetails.find(_ => _.id = 140010);
        console.log(generateCharacterWikiText(kkn));
    })

    it('should generate a story in wiki form', async () => {
        const characterDataProvider = new LocalDataProvider();
        const characterDetails = await characterDataProvider.fetchData();
        const kkn = characterDetails.find(_ => _.id === 140010);
        console.log(generateCharacterStoryText(kkn));
    })

    it('generate irh(normal)', async () => {
        const characterDataProvider = new LocalDataProvider();
        const characterDetails = await characterDataProvider.fetchData();
        const irh = characterDetails.find(_ => _.id === 110170);
        console.log(generateCharacterWikiText(irh));
    })
})