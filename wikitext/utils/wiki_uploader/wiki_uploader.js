const LocalProcessorProvider = require('../data_provider/local_data_provider');
const RemoteProcessorProvider = require('../data_provider/remote_data_provider');
const WikiClient = require('../http/wikiClient.js');
const WikiTextGenerator = require('../wiki_text_processing/character_wiki_generator');

class WikiUploader {
    constructor(useRemoteData) {
        this.characterInfosPromise = this.creatDataPromise(useRemoteData);
        const sessData = '6b7b18e8%2C1721491941%2C2fbe1%2A11CjAf0tEwI5uvWxy3rQERNXmuVL2ZkUkL1Eo7wxPycgo-qsSRE19_WV7tD-lfyidPAoISVk9BODE5VmE1TjIxTkpIaWJQeTdqYkk4SEEwRUZ3eHc0d3ItM3ItOURmdnlNb3BaZGRpSlJNRElSY1lFX1NyVVp1b25sWVhOMVVVX19tSDRndm5WN2tBIIEC';
        this.wc = new WikiClient(sessData);
    }

    async creatDataPromise(useRemoteData) {
        let dataProvider;
        if (useRemoteData) {
            dataProvider = new RemoteProcessorProvider();
        } else {
            dataProvider = new LocalProcessorProvider();
        }

        const currentTime = Date.now();

        return dataProvider
            .fetchData()
            // 此处添加初步筛选处理程序，去掉开头的非角色卡，和没有实装的卡
            .then(characterInfos => {
                return characterInfos
                    .filter(character => {
                        const displayTime = new Date(character.displayStartAt).getTime();
                        return character.id > 114514 && displayTime < currentTime;
                    })
            })
    }

    /**
     * 根据输入的卡面 id，上传剧情到 wiki 的故事（第四） section。
     * @param id
     * @returns {Promise<string>} 返回成功信息，不必要（可以打印）
     */
    async uploadCharacterStory(id) {
        const characterInfos = await this.characterInfosPromise;
        const characterInfo = characterInfos.find(_ => _.id === id);
        return await this.wc.editPage(characterInfo.name, WikiTextGenerator.getStoryText(characterInfo), {
            section: 4,
            nocreate: true,
        })
            .then(msg => {
                return '故事上传：' + msg;
            });
    }

    /**
     * 上传所有剧情到 wiki 的故事（第四） section。
     * @returns {Promise<string>} 返回成功信息，不必要（可以打印）
     */
    async uploadAllCharacterStory() {
        const characterInfos = await this.characterInfosPromise;
        characterInfos.forEach(characterInfo => {
            this.wc.editPage(characterInfo.name, WikiTextGenerator.getStoryText(characterInfo), {
                section: 4,
                nocreate: true,
            })
                .then(msg => {
                    return '故事上传：' + msg;
                })
                .then(console.log);
        })
        return '所有角色故事上传完毕';
    }


}

if (require.main === module) {
    wu = new WikiUploader();
    wu.uploadAllCharacterStory().then(console.log);

}