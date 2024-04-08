// noinspection DuplicatedCode

import {WikiUploader} from "../../../src/utils/wikiUploader";
import WikiClient from "../../../src/servers/wikiClient";
const sessData = '6b7b18e8%2C1721491941%2C2fbe1%2A11CjAf0tEwI5uvWxy3rQERNXmuVL2ZkUkL1Eo7wxPycgo-qsSRE19_WV7tD-lfyidPAoISVk9BODE5VmE1TjIxTkpIaWJQeTdqYkk4SEEwRUZ3eHc0d3ItM3ItOURmdnlNb3BaZGRpSlJNRElSY1lFX1NyVVp1b25sWVhOMVVVX19tSDRndm5WN2tBIIEC';

describe('WikiUploader Test', () => {
    const wikiClient = new WikiClient(sessData);
    const wu = new WikiUploader(wikiClient);

    it('should update a wiki story', async () => {
        const result = await wu.uploadCharacterStory(140300).then(console.log);
        console.log(result);
    })

    it('should update all template', async () => {
        const result = await wu.updateCharacterTemplate();
        console.log(result);
    }, 3600000)

    it('upload story', async () => {
        const result = await wu.uploadCharacterStory(140610);
        console.log(result);
    })

    it('should create a poster page', async ()=> {
        const result = await wu.createPosterPage(210200, false);
        console.log(result);
    }, 60000)

    it('should create all poster pages', async () => {
        const result = await wu.createAllPosterPage(false);
        console.log(result);
    }, 600000)

    it('should upload all pages not uploaded', async () => {
        const gameItems = await wu.getGameItemNotUploaded();
        console.log(gameItems);

        for (const gameItem of gameItems) {
            if (gameItem.type === 'Character') {
                console.log(await wu.createCharacterPage(gameItem.id));
                console.log(await wu.uploadImages(gameItem));
            } else if (gameItem.type === 'Poster') {
                console.log(await wu.createPosterPage(gameItem.id));
                console.log(await wu.uploadImages(gameItem));
            }
        }
    }, 600000);

    it('should upload images', async () => {
        const result = await wu.uploadImages({id: 220290, type: 'Poster'});
        console.log(result);
    }, 600000);

    it('should upload wanted images', async () => {
        const result = await wu.uploadWantedImages();
        console.log(result);
    }, 600000);

    it('should download to cache', async () => {
        const result = await wu.downloadDetails();
        console.log(result);
    }, 600000);
})

