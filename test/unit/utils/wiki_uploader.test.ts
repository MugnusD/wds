
// const sessData = '6b7b18e8%2C1721491941%2C2fbe1%2A11CjAf0tEwI5uvWxy3rQERNXmuVL2ZkUkL1Eo7wxPycgo-qsSRE19_WV7tD-lfyidPAoISVk9BODE5VmE1TjIxTkpIaWJQeTdqYkk4SEEwRUZ3eHc0d3ItM3ItOURmdnlNb3BaZGRpSlJNRElSY1lFX1NyVVp1b25sWVhOMVVVX19tSDRndm5WN2tBIIEC';
// const wu = new WikiUploader(sessData);
// wu.uploadCharacterStory(130250).then(console.log);

import {WikiUploader} from "../../../src/utils/wiki_uploader";
import WikiClient from "../../../src/utils/http/wikiClient";
const sessData = '6b7b18e8%2C1721491941%2C2fbe1%2A11CjAf0tEwI5uvWxy3rQERNXmuVL2ZkUkL1Eo7wxPycgo-qsSRE19_WV7tD-lfyidPAoISVk9BODE5VmE1TjIxTkpIaWJQeTdqYkk4SEEwRUZ3eHc0d3ItM3ItOURmdnlNb3BaZGRpSlJNRElSY1lFX1NyVVp1b25sWVhOMVVVX19tSDRndm5WN2tBIIEC';


describe('WikiUploader Test', () => {
    const wikiClient = new WikiClient(sessData);
    const wu = new WikiUploader(wikiClient);

    it('should update a wiki story', async () => {
        const result = await wu.uploadCharacterStory(140300).then(console.log);
        console.log(result);
    })

    it('should upload normal card story', async () => {
        await wu.uploadCharacterStory(110010);
        const start = 110010;
        const end = 110210;
        const interval = 10;
        const length = (end - start) / interval + 1;
        const array = Array.from({ length }, (_, index) => start + index * interval);
        for (const id of array) {
            const result = await wu.uploadCharacterStory(id);
            console.log(result);
        }
        console.log('end');
    }, 100000)

    it('should upload all icon image', async () => {
        const result = await wu.uploadImages('Icon');
        console.log(result);
    })

    it('should update all template', async () => {
        const result = await wu.updateCharacterTemplate();
        console.log(result);
    }, 3600000)

    it('should get unuploadedIDs', async () => {
        const result = await wu.getUnuploadedCharacterIDs();
        console.log(result);
    }, 60000)

    it('upload story', async () => {
        const result = await wu.uploadCharacterStory(140490);
        console.log(result);
    })

})