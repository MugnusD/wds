import {CharacterDetail} from "../domain/characterDetails";
import WikiClient from "./http/wikiClient";
import {DataProvider} from "./data_provider/data_provider";
import {RemoteDataProvider} from "./data_provider/remote_data_provider";
import {LocalDataProvider} from "./data_provider/local_data_provider";
import fs, {Stats} from "fs";
import {generateCharacterWikiText} from "./wiki_text_processing/generate_character_wt";
import {characterBaseInfoArray} from "../domain/characterBaseInfo";
import {generateCharacterStoryText} from "./wiki_text_processing/generate_character_story_wt";
import {PosterDetail} from "../domain/posterDetails";
import {generatePosterWikiText} from "./wiki_text_processing/generate_poster_wt";
import {produce} from "immer";

interface ImageUploaderInfo {
    uploadFileName: string;
    id: number;
    localPath: string;
}

type GameItemType = 'Character' | `Poster`;

interface GameItem {
    id: number;
    type: GameItemType;
}

class WikiUploader {
    private readonly characterDetailsPromise: Promise<CharacterDetail[]>;
    private readonly posterDetailsPromise: Promise<PosterDetail[]>;
    private readonly wc: WikiClient;

    constructor(wc: WikiClient, useRemoteData: boolean = true) {
        const {characterDetailsPromise, posterDetailsPromise} = this.createDataPromise(useRemoteData);
        this.characterDetailsPromise = characterDetailsPromise;
        this.posterDetailsPromise = posterDetailsPromise;

        this.wc = wc;
    }

    private createDataPromise(useRemoteData: boolean): {
        characterDetailsPromise: Promise<CharacterDetail[]>,
        posterDetailsPromise: Promise<PosterDetail[]>
    } {
        let dataProvider: DataProvider;
        if (useRemoteData) {
            dataProvider = new RemoteDataProvider();
        } else {
            dataProvider = new LocalDataProvider();
        }

        const currentTime: number = Date.now();
        const characterDetailsPromise = dataProvider.fetchData('character')
            .then(characterDetails => {
                characterDetails = characterDetails.filter(characterDetail => {
                    // 筛选没有实装的卡
                    const displayTime = new Date(characterDetail.displayStartAt).getTime();
                    return displayTime < currentTime;
                });

                characterDetails.forEach(characterDetail => {
                    // 一星卡处理
                    if (characterDetail.id <= 114514) {
                        const chineseName = characterBaseInfoArray.find(characterInfo =>
                            characterInfo.name === characterDetail.characterBase).chineseName;
                        characterDetail.name = characterDetail.name + `（${chineseName}）`;
                    }

                    // 将全角空格换位半角
                    characterDetail.name = characterDetail.name.replace('　', ' ');

                    // 将 # 换为全角
                    characterDetail.name = characterDetail.name.replace(/#/g, '＃');
                });

                return characterDetails;
            });
        // // 初步处理程序，1 星卡添加前缀、筛选没有实装的卡
        // .then(characterDetails => {
        //     return characterDetails
        //         // 一星卡处理
        //         .map(characterDetail => {
        //             if (characterDetail.id > 114514) {
        //                 return characterDetail;
        //             } else {
        //                 const chineseName = characterBaseInfoArray.find(characterInfo =>
        //                     characterInfo.name === characterDetail.characterBase).chineseName;
        //                 characterDetail.name = characterDetail.name + `（${chineseName}）`;
        //                 return characterDetail;
        //             }
        //         })
        //         // 筛选没有实装的卡
        //         .filter(characterDetail => {
        //             const displayTime = new Date(characterDetail.displayStartAt).getTime();
        //             return displayTime < currentTime;
        //         })
        //         // 将全角空格换位半角
        //         .map(characterDetail => {
        //             if (characterDetail.name.includes('　')) {
        //                 characterDetail.name = characterDetail.name.replace('　', ' ');
        //                 return characterDetail;
        //             } else {
        //                 return characterDetail;
        //             }
        //         })
        //         // 将 # 换为全角
        //         .map(characterDetail => {
        //             if (characterDetail.name.includes('#')) {
        //                 characterDetail.name = characterDetail.name.replace('#', '＃');
        //                 return characterDetail;
        //             } else {
        //                 return characterDetail;
        //             }
        //         });
        // });

        const posterDetailsPromise = dataProvider.fetchData('poster')
            .then(posterDetails => {
                // 筛选没有实装的海报
                posterDetails = posterDetails.filter(posterDetail => {
                    const displayTime = new Date(posterDetail.displayStartAt).getTime();
                    return displayTime < currentTime;
                });

                posterDetails.forEach(posterDetail => {
                    // 将全角空格换位半角
                    posterDetail.name = posterDetail.name.replace('　', ' ');

                    // 将 # 换为全角
                    posterDetail.name = posterDetail.name.replace('#', '＃');
                });

                return posterDetails;
            });

        // .then(posterDetails => {
        //     return posterDetails
        //         // 筛选没有实装的
        //         .filter(posterDetail => {
        //             const displayTime = new Date(posterDetail.displayStartAt).getTime();
        //             return displayTime < currentTime;
        //         })
        //         // 将全角空格换位半角
        //         .map(posterDetail => {
        //             if (posterDetail.name.includes('　')) {
        //                 posterDetail.name = posterDetail.name.replace('　', ' ');
        //                 return posterDetail;
        //             } else {
        //                 return posterDetail;
        //             }
        //         })
        //         // 将 # 换为全角
        //         .map(posterDetail => {
        //             if (posterDetail.name.includes('#')) {
        //                 posterDetail.name = posterDetail.name.replace('#', '＃');
        //                 return posterDetail;
        //             } else {
        //                 return posterDetail;
        //             }
        //         });
        // });

        return {
            characterDetailsPromise,
            posterDetailsPromise
        };
    }

    /**
     * 创建指定角色（id）的页面
     * @param id
     * @param createonly
     */
    public async createCharacterPage(id: number, createonly: boolean = true): Promise<string> {
        const characterDetails: CharacterDetail[] = await this.characterDetailsPromise;
        const characterDetail = characterDetails.find(character => character.id === id);

        const wikiText = generateCharacterWikiText(characterDetail, false);
        const result = await this.wc.editPage(characterDetail.name, wikiText, {
            createonly: createonly,
        });
        return '新建页面成功' + result;
    }

    /**
     * 上传指定角色（id）的故事
     * @param id 角色卡面 id
     */
    public async uploadCharacterStory(id: number): Promise<string> {
        const characterDetails: CharacterDetail[] = await this.characterDetailsPromise;
        const characterDetail: CharacterDetail = characterDetails.find(_ => _.id === id);
        const storyText = generateCharacterStoryText(characterDetail);
        characterDetail.name;
        return await this.wc.editPage(characterDetail.name, storyText, {
            section: 4,
            nocreate: true,
        })
            .then(msg => {
                return '故事上传：' + msg;
            })
    }

    public async getGameItemNotUploaded(): Promise<GameItem[]> {
        const allTitleArray: string[] = await this.wc.getPageTitles();

        // Wiki 会自动首字母大写，需要
        for (let i = 0; i < allTitleArray.length; i++) {
            allTitleArray[i] = allTitleArray[i].toLowerCase();
        }
        const characterDetails: CharacterDetail[] = await this.characterDetailsPromise;
        const posterDetails: PosterDetail[] = await this.posterDetailsPromise;

        const gameItems: GameItem[] = [];

        characterDetails.forEach(characterDetail => {
            if (!(allTitleArray.includes(characterDetail.name.toLowerCase()))) {
                gameItems.push({
                    id: characterDetail.id,
                    type: 'Character',
                });
            }
        });

        posterDetails.forEach(posterDetail => {
            if (!(allTitleArray.includes(posterDetail.name.toLowerCase()))) {
                gameItems.push({
                    id: posterDetail.id,
                    type: 'Poster',
                })
            }
        });

        return gameItems;
    }

    public async getUnuploadedCharacterIDs() {
        const characterDetails: CharacterDetail[] = await this.characterDetailsPromise;
        const allTitlesArray = await this.wc.getPageTitles();
        return characterDetails
            .filter(characterDetail => !(allTitlesArray.includes(characterDetail.name)))
            .map(_ => _.id);
    }

    public async createPosterPage(id: number, createonly: boolean = true) {
        const posterDetails = await this.posterDetailsPromise;
        const posterDetail = posterDetails.find(_ => _.id === id);

        const wikiText = generatePosterWikiText(posterDetail);
        const result = await this.wc.editPage(posterDetail.name, wikiText, {
            createonly: createonly,
        });
        return `新建海报页面成功` + result;
    }

    public async createAllPosterPage(creatonly: boolean = true) {
        const posterDetails = await this.posterDetailsPromise;
        for (const posterDetail of posterDetails) {
            // 暂时
            if (posterDetail.id === 220410) continue;
            if (posterDetail.id === 230190) continue;

            const result = await this.createPosterPage(posterDetail.id, creatonly);
            console.log(result);
        }
        return '上传完毕';
    }

    /**
     * 上传对应的卡牌的文件。暂时实现了：
     * 角色：上传对应的角色卡面和头像（如果是 4 星要同时上传花前花后）
     * 海报：上传对应的海报（暂时没上传 thumbnail）
     * @param gameItem
     */
    public async uploadImages(gameItem: GameItem) {
        const {id, type} = gameItem;
        const url = 'https://sirius.3-3.dev/asset/';
        if (type === 'Character') {
            const characterDetails: CharacterDetail[] = await this.characterDetailsPromise;
            const characterDetail: CharacterDetail = characterDetails.find(_ => _.id === id);
            await this.wc.uploadFile(`Card ${id} 0`, url + `character/${id}_0.png`, true, true);
            await this.wc.uploadFile(`Icon ${id} 0`, url + `character-thumbnail/${id}_0.png`, true, true);

            if (characterDetail.rarity === 'Rare4') {
                await this.wc.uploadFile(`Card ${id} 1`, url + `character/${id}_1.png`, true, true);
                await this.wc.uploadFile(`Icon ${id} 1`, url + `character-thumbnail/${id}_1.png`, true, true);
            }

            return characterDetail.name + " 角色图片上传完毕";
        } else if (type === 'Poster') {
            const posterDetails: PosterDetail[] = await this.posterDetailsPromise;
            const posterDetail: PosterDetail = posterDetails.find(_ => _.id === id);
            await this.wc.uploadFile(`Post_${id}`, url + `poster/${id}.png`, true, true);
            return posterDetail.name + " 海报图片上传完毕";
        }
    }

    /**
     * 插叙所有确实的图片，然后上传。
     * 依赖于 uploadImages() 方法。
     */
    public async uploadWantedImages() {
        const wantedFileTitles: string[] = await this.wc.getWantedFileTitles();
        const regex: RegExp = /^文件:(Poster|Card)\s((\d{6})\s(\d)?)\.png/;
        const url = 'https://sirius.3-3.dev/asset/';

        for (const fileTitle of wantedFileTitles) {
            if (!regex.test(fileTitle)) {
                continue;
            }
            const [title, type, fileName, id, suffix] = regex.exec(fileTitle);

            if (type === 'Card') {
                console.log(await this.wc.uploadFile(fileTitle, url + `character/${id}_${suffix}.png`, true, true));
            } else if (type === 'Icon') {
                console.log(await this.wc.uploadFile(fileTitle, url + `character-thumbnail/${id}_${suffix}.png`, true, true));
            } else if (type === 'Poster') {
                console.log(await this.wc.uploadFile(fileTitle, url + `poster/${id}.png`, true, true));
            }
        }

        return '上传完毕';
    }

    public async updateCharacterTemplate(): Promise<string> {
        const characterDetails: CharacterDetail[] = await this.characterDetailsPromise;
        for (const characterDetail of characterDetails) {
            const content: string = await this.wc.getPageContent(characterDetail.name);
            if (!content) continue;

            const regex = /({{卡面信息[\s\S]*?}})/;
            const match = regex.exec(content);

            if (match) {
                const newTemplate = generateCharacterWikiText(characterDetail, true);
                const newWikiText = content.replace(match[1], newTemplate);
                const result = await this.wc.editPage(characterDetail.name, newWikiText, {
                    nocreate: true,
                });
                console.log('模板更新: ' + result);
            }
        }
        return '更新完成';
    }

    public async downloadDetails() {
        await this.characterDetailsPromise
            .then(result => {
                fs.writeFileSync(__dirname + '/../cache/all_character.json', JSON.stringify(result, null, 2));
            });

        await this.posterDetailsPromise
            .then(result => {
                fs.writeFileSync(__dirname + '/../cache/all_poster.json', JSON.stringify(result, null, 2));
            })
        return '写入完成';
    }
}

export {
    WikiUploader
};
