import WikiClient from "../servers/wikiClient";
import fs from "fs";
import proFs from "node:fs/promises";
import {generateCharacterWikiText} from "./wikiTextProcessing/characterText/generateCharacterWikiText";
import {characterBaseInfoArray} from "./wikiTextProcessing/characterBaseInfo";

import {generatePosterWikiText} from "./wikiTextProcessing/posterText/generatePosterWikiText";
import {AccessoryService, CharacterService, GithubDataProvider, PosterService} from "sirius-calculator";
import path from "path";
import axios from "axios";
import {differenceInDays, isBefore} from "date-fns";
import {generateSprite} from "./imageProcessing/imgSprite";
import {generateAccessoryTableWt} from "./wikiTextProcessing/accessoryTest/generateAccessoryTableWt";

type GameItemType = 'Character' | `Poster`;

interface GameItem {
    id: number;
    type: GameItemType;
}

export class WikiUploader {
    private readonly characterDetailsPromise: Promise<CharacterDetail[]>;
    private readonly posterDetailsPromise: Promise<PosterDetail[]>;
    private readonly accessoryDetailsPromise: Promise<AccessoryDetail[]>;
    private readonly wc: WikiClient;
    private readonly url = 'https://sirius.3-3.dev/asset/';

    constructor(wc: WikiClient) {
        const {
                  characterDetailsPromise,
                  posterDetailsPromise,
                  accessoryDetailsPromise,
              } = this.createDataPromise();
        this.characterDetailsPromise = characterDetailsPromise;
        this.posterDetailsPromise = posterDetailsPromise;
        this.accessoryDetailsPromise = accessoryDetailsPromise;

        this.wc = wc;
    }

    private createDataPromise(): {
        characterDetailsPromise: Promise<CharacterDetail[]>,
        posterDetailsPromise: Promise<PosterDetail[]>,
        accessoryDetailsPromise: Promise<AccessoryDetail[]>,
    } {
        const characterService = new CharacterService();
        const posterService = new PosterService();
        const accessoryService = new AccessoryService();

        const currentTime = new Date();
        const characterDetailsPromise = characterService.getAllCharacterDetails()
            .then(characterDetails => {
                characterDetails = characterDetails.filter(characterDetail => {
                    // 筛选没有实装的卡
                    const displayTime = new Date(characterDetail.displayStartAt);
                    return isBefore(displayTime, currentTime) || differenceInDays(displayTime, currentTime) <= 2;
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

        const posterDetailsPromise = posterService.getAllPosterDetails()
            .then(posterDetails => {
                // 筛选没有实装的海报 & 没有技能的废海报
                posterDetails = posterDetails
                    .filter(posterDetail => {
                        const displayTime = new Date(posterDetail.displayStartAt);
                        return isBefore(displayTime, currentTime) || differenceInDays(displayTime, currentTime) <= 2;
                    })
                    .filter(posterDetail => posterDetail.abilities.length !== 0);

                posterDetails.forEach(posterDetail => {
                    // 将全角空格换位半角
                    posterDetail.name = posterDetail.name.replace('　', ' ');

                    // 将 # 换为全角
                    posterDetail.name = posterDetail.name.replace('#', '＃');
                });

                return posterDetails;
            });

        const accessoryDetailsPromise = accessoryService.getAccessoryDetails();

        return {
            characterDetailsPromise,
            posterDetailsPromise,
            accessoryDetailsPromise,
        };
    }

    /**
     * 创建指定角色（id）的页面
     */
    public async createCharacterPage(id: number, createonly: boolean = true): Promise<string> {
        const characterDetails: CharacterDetail[] = await this.characterDetailsPromise;
        const characterDetail = characterDetails.find(character => character.id === id);

        const wikiText = generateCharacterWikiText(characterDetail);
        const result = await this.wc.editPage(characterDetail.name, await wikiText, {
            createonly: createonly,
        });
        return '新建页面成功 ' + result;
    }

    public async createAllCharacterPage(creatonly: boolean = true) {
        const characterDetails = await this.characterDetailsPromise;

        for (const characterDetail of characterDetails) {
            const result = await this.createCharacterPage(characterDetail.id, creatonly);
            console.log(result);
        }
        return '上传完毕';
    }

    /*
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
                });
        }*/

    public async getGameItemNotUploaded(): Promise<GameItem[]> {
        const allTitleArray: string[] = await this.wc.getPageTitles();

        // Wiki 会自动首字母大写，需要 toLowerCase()
        allTitleArray.forEach((title, index, array) => {
            array[index] = title.toLowerCase();
        });
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
                });
            }
        });

        return gameItems;
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
            const result = await this.createPosterPage(posterDetail.id, creatonly);
            console.log(result);
        }
        return '上传完毕';
    }

    public async createAccessoryPage() {
        const accessoryDetails: AccessoryDetail[] = await this.accessoryDetailsPromise;
        const wikiText = generateAccessoryTableWt(accessoryDetails);

        const result = await this.wc.editPage('饰品列表', wikiText, {
            createonly: false,
        });
        return `Accessory page updated successfully`;
    }

    /**
     * 上传对应的卡牌的文件。暂时实现了：
     * 角色：上传对应的角色卡面和头像（如果是 4 星要同时上传花前花后）
     * 海报：上传对应的海报（暂时没上传 thumbnail）
     * @param gameItem
     */
    public async uploadImages(gameItem: GameItem) {
        const url = 'https://sirius.3-3.dev/asset/';

        const {
                  id,
                  type,
              } = gameItem;

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
            await this.wc.uploadFile(`Poster ${id} 0`, url + `poster/${id}.png`, true, true);
            return posterDetail.name + " 海报图片上传完毕";
        }
    }

    /**
     * 下载图片资源，暂用（考虑移除）
     * @param id
     * @param rarity
     */
    public async downloadCharacterIcon(id: number, rarity: string): Promise<void> {
        const url = 'https://sirius.3-3.dev/asset/';
        let imageUrl = url + `character-thumbnail/${id}_0.png`;
        let localFilePath = path.join(__dirname, `../../cache_asset/icons/characterIcons/${id}_0.png`);

        let response = await axios({
            method: "get",
            url: imageUrl,
            responseType: "stream",
        });

        response.data.pipe(fs.createWriteStream(localFilePath));
        console.log(`${id}_0 downloading completed`);

        if (rarity === 'Rare4') {
            imageUrl = url + `character-thumbnail/${id}_1.png`;
            localFilePath = path.join(__dirname, `../../cache_asset/icons/characterIcons/${id}_1.png`);

            response = await axios({
                method: "get",
                url: imageUrl,
                responseType: "stream",
            });

            response.data.pipe(fs.createWriteStream(localFilePath));
            console.log(`${id}_1 downloading completed`);
        }
    }

    public async downloadAllCharacterIcon(): Promise<void> {
        const directoryPath = path.join(__dirname, '/../../cache_asset/icons/characterIcons/');
        const imageFiles = await proFs.readdir(directoryPath);

        // ids of icons already downloaded
        const existedIdSet = new Set(imageFiles.map(fileName => fileName.slice(0, 6)));
        const existedIds = Array.from(existedIdSet);

        const characterDetails: CharacterDetail[] = await this.characterDetailsPromise;
        // only download missed icons
        const wantedIds: { id: number, rarity: string }[] = [];
        characterDetails.forEach(characterDetail => {
            if (!existedIds.includes(String(characterDetail.id))) {
                wantedIds.push({id: characterDetail.id, rarity: characterDetail.rarity});
            }
        });

        for (const {id, rarity} of wantedIds) {
            await this.downloadCharacterIcon(id, rarity);
        }

        console.log('Character icons updated!');

        // Sprite
        const spriteFilePath = path.join(__dirname, '/../../cache_asset/output/character_sprite.webp');
        const spriteJsonFilePath = path.join(__dirname, '/../../cache_asset/output/character_sprite.json');

        const files = await proFs.readdir(directoryPath);
        const inputs = files.map(file => path.join(directoryPath, file));

        await generateSprite(
            inputs,
            188,
            spriteFilePath,
            spriteJsonFilePath,
        );
    }

    /**
     * 下载图片资源，暂用（考虑移除）
     * @param id
     */
    public async downloadPosterIcon(id: number): Promise<void> {
        const url = 'https://sirius.3-3.dev/asset/';

        const imageUrl = url + `poster-thumbnail/${id}.png`;
        const localFilePath = path.join(__dirname, `/../../cache_asset/icons/posterIcons/${id}.png`);

        await axios({
            method: 'get',
            url: imageUrl,
            responseType: 'stream',
        }).then(response => {
            response.data.pipe(fs.createWriteStream(localFilePath));
        });

        console.log(`${id} downloading completed`);
    }


    public async downloadAllPosterIcon(): Promise<void> {
        const directoryPath = path.join(__dirname, '/../../cache_asset/icons/posterIcons/');
        const imageFiles = await proFs.readdir(directoryPath);

        // ids of icons already downloaded
        const existedIdSet = new Set(imageFiles.map(fileName => fileName.slice(0, 6)));
        const existedIds = Array.from(existedIdSet);

        const posterDetails: PosterDetail[] = await this.posterDetailsPromise;
        // only download missed icons
        const wantedIds: number[] = [];
        posterDetails.forEach(posterDetail => {
            if (!existedIds.includes(String(posterDetail.id))) {
                wantedIds.push(posterDetail.id);
            }
        });

        for (const id of wantedIds) {
            await this.downloadPosterIcon(id);
        }

        console.log('Poster icons updated!');

        // Sprite
        const spriteFilePath = path.join(__dirname, '/../../cache_asset/output/poster_sprite.webp');
        const spriteJsonFilePath = path.join(__dirname, '/../../cache_asset/output/poster_sprite.json');

        const files = await proFs.readdir(directoryPath);
        const inputs = files.map(file => path.join(directoryPath, file));

        await generateSprite(
            inputs,
            188,
            spriteFilePath,
            spriteJsonFilePath,
        );
    }

    public async downloadAccessoryIcon(id: number): Promise<void> {
        const url = this.url;

        const imageUrl = url + `accessory-thumbnail/${id}.png`;
        const localFilePath = path.join(__dirname, `/../../cache_asset/icons/accessoryIcons/${id}.png`);

        await axios({
            method: 'get',
            url: imageUrl,
            responseType: 'stream',
        }).then(response => {
            response.data.pipe(fs.createWriteStream(localFilePath));
        });

        console.log(`${id} downloading completed`);
    }

    public async downloadAllAccessoryIcon(): Promise<void> {
        const directoryPath = path.join(__dirname, '/../../cache_asset/icons/accessoryIcons/');
        const imageFiles = await proFs.readdir(directoryPath);

        // ids of icons already downloaded
        const existedIdSet = new Set(imageFiles.map(fileName => fileName.slice(0, 6)));
        const existedIds = Array.from(existedIdSet);

        const accessoryDetails: AccessoryDetail[] = await this.accessoryDetailsPromise;
        // only download missed icons
        const wantedIds: number[] = [];
        accessoryDetails.forEach(accessoryDetail => {
            if (!existedIds.includes(String(accessoryDetail.id))) {
                wantedIds.push(accessoryDetail.id);
            }
        });

        for (const id of wantedIds) {
            await this.downloadAccessoryIcon(id);
        }

        console.log('Accessory icons updated!');

        // Sprite
        const spriteFilePath = path.join(__dirname, '/../../cache_asset/output/accessory_sprite.webp');
        const spriteJsonFilePath = path.join(__dirname, '/../../cache_asset/output/accessory_sprite.json');

        const files = await proFs.readdir(directoryPath);
        const inputs = files.map(file => path.join(directoryPath, file));

        await generateSprite(
            inputs,
            188,
            spriteFilePath,
            spriteJsonFilePath,
            0.8,
            true,
        );
    }


    /**
     * 插叙所有确实的图片，然后上传。
     * 依赖于 uploadImages() 方法。
     */
    public async uploadWantedImages() {
        const url = 'https://sirius.3-3.dev/asset/';
        const wantedFileTitles: string[] = await this.wc.getWantedFileTitles();
        const regex: RegExp = /^文件:(Poster|Card|Accessory)\s((\d{6})(\s(\d))?)\.png/;

        console.log(wantedFileTitles);

        for (const fileTitle of wantedFileTitles) {
            if (!regex.test(fileTitle)) {
                continue;
            }
            const [title, type, fileName, id, suffixWithSpace, suffix] = regex.exec(fileTitle);

            if (type === 'Card') {
                console.log(await this.wc.uploadFile(fileTitle, url + `character/${id}_${suffix}.png`, true, true));
            } else if (type === 'Icon') {
                console.log(await this.wc.uploadFile(fileTitle, url + `character-thumbnail/${id}_${suffix}.png`, true, true));
            } else if (type === 'Poster') {
                console.log(await this.wc.uploadFile(fileTitle, url + `poster/${id}.png`, true, true));
            } else if (type === 'Accessory') {
                console.log(await this.wc.uploadFile(fileTitle, url + `accessory-thumbnail/${id}.png`, true, true));
            }
        }

        return 'Uploading completed';
    }

    public async uploadComic() {
        const comicsPath = path.join(__dirname + '/../../cache_asset/processedComic');
        const files = await proFs.readdir(comicsPath);

        let text = `<div style="display: grid;grid-template-columns: repeat(auto-fill, 220px);grid-template-rows: repeat(auto-fill, 180px);place-items: center center;">`;

        for (const file of files) {
            console.log(await this.wc.uploadFile(`Comic_${file}`, path.join(comicsPath, file)));

            text += `{{漫画单元
|图片=Comic_${file}
|标题=${file}
}}`;
        }

        text += '</div>';
        console.log(await this.wc.editPage('漫画列表', text));

        return 'Uploading completed';
    }

    public async downloadDetails() {
        await this.characterDetailsPromise
            .then(result => {
                fs.writeFileSync(path.join(__dirname, '/../../cache_asset/output/all_character.json'), JSON.stringify(result, null, 2));
            });

        await this.posterDetailsPromise
            .then(result => {
                fs.writeFileSync(path.join(__dirname, '/../../cache_asset/output/all_poster.json'), JSON.stringify(result, null, 2));
            });

        await this.accessoryDetailsPromise
            .then(result => {
                fs.writeFileSync(path.join(__dirname, '/../../cache_asset/output/all_accessory.json'), JSON.stringify(result, null, 2));
            });

        return 'Writing to cache completed';
    }
}