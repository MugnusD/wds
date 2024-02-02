import {CharacterDetail} from "../definitions/CharacterDetails";
import WikiClient from "./http/wikiClient";
import {DataProvider} from "./data_provider/data_provider";
import {RemoteDataProvider} from "./data_provider/remote_data_provider";
import {LocalDataProvider} from "./data_provider/local_data_provider";
import fs, {Stats} from "fs";
import path from "path";
import {generateCharacterWikiText} from "./wiki_text_processing/generate_character_wt";
import {characterBaseInfoArray} from "../definitions/character_base_info";
import {generateCharacterStoryText} from "./wiki_text_processing/generate_character_story_wt";

type ImageType = 'Icon' | 'Card';

interface ImageUploaderInfo {
    uploadFileName: string;
    localPath: string;
}

class WikiUploader {
    private readonly characterDetailsPromise: Promise<CharacterDetail[]>;
    private readonly wc: WikiClient;
    private readonly matchingFiles: ImageUploaderInfo[];

    constructor(wc: WikiClient, useRemoteData: boolean = false) {
        this.characterDetailsPromise = this.createDataPromise(useRemoteData);
        this.wc = wc;
        this.matchingFiles = [];
    }

    private createDataPromise(useRemoteData: boolean): Promise<CharacterDetail[]> {
        let dataProvider: DataProvider;
        if (useRemoteData) {
            dataProvider = new RemoteDataProvider();
        } else {
            dataProvider = new LocalDataProvider();
        }

        const currentTime: number = Date.now();
        return dataProvider
            .fetchData()
            // 初步处理程序，1 星卡添加前缀、筛选没有实装的卡
            .then(characterInfos => {
                return characterInfos
                    // 一星卡处理
                    .map(characterDetail => {
                        if (characterDetail.id > 114514) {
                            return characterDetail;
                        } else {
                            const chineseName = characterBaseInfoArray.find(characterInfo => characterInfo.name === characterDetail.characterBase).chineseName;
                            characterDetail.name = characterDetail.name + `（${chineseName}）`;
                            return characterDetail;
                        }
                    })
                    // 筛选没有实装的卡
                    .filter(characterDetail => {
                        const displayTime = new Date(characterDetail.displayStartAt).getTime();
                        return displayTime < currentTime;
                    })
                    // 将全角空格换位半角
                    .map(characterDetail => {
                        if(characterDetail.name.includes('　')) {
                            characterDetail.name = characterDetail.name.replace('　', ' ');
                            return characterDetail;
                        } else {
                            return characterDetail;
                        }
                    })
            })
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

    public async getUnuploadedCharacterIDs() {
        const characterDetails: CharacterDetail[] = await this.characterDetailsPromise;
        const allTitlesArray = await this.wc.getPageTitles();
        const hkr = allTitlesArray.includes('ん～っ！ デリシャス！');
        return characterDetails
            .filter(characterDetail => !(allTitlesArray.includes(characterDetail.name)))
            .map(_ => _.id);
    }

    // public async uploadAllCharacterStory() {
    //     const characterDetails: CharacterDetail[] = await this.characterDetailsPromise;
    //     for (const characterInfo of characterDetails) {
    //         const msg = await this.wc.editPage(characterInfo.name, generateCharacterStoryText(characterInfo), {
    //             section: 4,
    //             nocreate: true,
    //         });
    //         console.log('故事上传：' + msg);
    //     }
    // }

    /**
     * 上传指定类型的图片（所有）
     * @param imageType
     */
    public async uploadImages(imageType: ImageType) {
        const characterDetails: CharacterDetail[] = await this.characterDetailsPromise;
        // 所有资源都存放在这个绝对目录下，待修改为网络资源获取
        const srcPath = 'E:\\html_code\\src';
        let folderPath: string;
        if (imageType === 'Icon') {
            folderPath = path.join(srcPath, 'icons');
        } else if (imageType === 'Card') {
            folderPath = path.join(srcPath, 'characters');
        }

        // 这个调用将改变 this.matchingFiles
        this.traverseImageFilesInFolder(folderPath, imageType);

        const matchingFiles = this.matchingFiles;
        const wc: WikiClient = this.wc;
        const promises: Promise<any>[] = [];

        function upLoadFileSequentially(index) {
            if (index < matchingFiles.length) {
                const imageUploaderInfo: ImageUploaderInfo = matchingFiles[index];
                const promise = wc.uploadFile(imageUploaderInfo.uploadFileName, imageUploaderInfo.localPath)
                    .then(data => {
                        index++;
                        console.log(`文件 ${imageUploaderInfo.uploadFileName} 上传成功`);
                        setTimeout(() => upLoadFileSequentially(index), 300);
                    })
                    .catch(data => {
                        index++;
                        console.log(`文件 ${imageUploaderInfo.uploadFileName} 上传失败`);
                        setTimeout(() => upLoadFileSequentially(index), 300);
                    });

                promises.push(promise);
            }
        }

        upLoadFileSequentially(0);
        await Promise.all(promises);
        console.log('上传完毕');
    }

    private traverseImageFilesInFolder(folderPath: string, imageType: ImageType) {
        const files: string[] = fs.readdirSync(folderPath);
        files.forEach(fileName => {
            const filePath: string = path.join(folderPath, fileName);
            const stats: Stats = fs.statSync(filePath);

            if (stats.isDirectory()) {
                this.traverseImageFilesInFolder(filePath, imageType);
            } else {
                const regex = /^(\d{6})_([01])\.png$/;
                const result = regex.exec(fileName);
                if (regex.test(fileName)) {
                    this.matchingFiles.push({
                        uploadFileName: imageType + ' ' + result[1] + ' ' + result[2] + '.png',
                        localPath: filePath,
                    });
                }
            }
        });
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
}

export {
    WikiUploader
};
