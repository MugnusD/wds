import WikiClient from "../../../../src/servers/wikiClient";

const sessData = '6b7b18e8%2C1721491941%2C2fbe1%2A11CjAf0tEwI5uvWxy3rQERNXmuVL2ZkUkL1Eo7wxPycgo-qsSRE19_WV7tD-lfyidPAoISVk9BODE5VmE1TjIxTkpIaWJQeTdqYkk4SEEwRUZ3eHc0d3ItM3ItOURmdnlNb3BaZGRpSlJNRElSY1lFX1NyVVp1b25sWVhOMVVVX19tSDRndm5WN2tBIIEC';

describe('WikiClient test', () => {
    const wc = new WikiClient(sessData);

    it('test invalid sessData token', async () => {
        const invalidSessData = "abcd";
        const invalidClient = new WikiClient(invalidSessData);

        const result = await invalidClient.getCsrfToken();
        expect(result).toBe('+\\');
    })

    it('should edit a whole new page successfully', async () => {
        const result = await wc.editPage('用户:39886146/EditTest', '编辑测试');
        console.log(result);
    });

    it('should edit a story', () => {
        wc.editPage('用户:30315258/Main test', '===卡面故事===story2', {
            section: 4,
            nocreate: true,
        }).then(console.log);
    });

    it('should upload a pic', () => {
        wc.uploadFile('Icon_110010_0.png', 'E:\\html_code\\src\\icons\\110010_0.png', true).then(console.log);
    })

    it('if there is a zero section?', async () => {
        const result = await wc.editPage('用户:30315258/Main_test', 'section 0', {
            nocreate: true,
            section: 0,
        });
        console.log(result);
    })

    it('test get content', async () => {
        const result = await wc.getPageContent('用户:30315258/Main_test');
        console.log(result);
    })

    it('test get titles', async () => {
        const result = await wc.getPageTitles();
        console.log(result);
    }, 60000)

    it('should upload a local image', async () => {
        const result = await wc.uploadFile('Icon_140880_0.png', 'E:\\html_code\\wds\\src\\cache\\140880_0.png');
        console.log(result);
    }, 600000);

    it('should upload a remote image', async () => {
        const result = await wc.uploadFile('Icon_140880_0.png', 'https://sirius.3-3.dev/asset/character-thumbnail/140880_0.png', false, true);
        console.log(result);
    }, 600000);

    it('test getWantedPageList', async () => {
        const result = await wc.getWantedFileTitles();
        console.log(result);
    }, 600000);
})