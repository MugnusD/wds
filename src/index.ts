import {WikiUploader} from "./utils/wikiUploader";
import WikiClient from "./servers/wikiClient";
import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


async function initializeWikiClient(): Promise<WikiClient> {
    return new Promise((resolve) => {
        rl.question('Please input your SESSDATA: ', async (input) => {
            const wikiClient = new WikiClient(input);

            if (!(await wikiClient.checkCsrfToken())) {
                console.log('Wrong SESSDATA');
                process.exit(1);
            }

            resolve(wikiClient);
        });
    });
}

function askQuestion(question: string): Promise<boolean> {
    return new Promise((resolve) => {
        rl.question(question, (input) => {
            const formattedInput = input.trim().toLowerCase();

            if (formattedInput === '' || formattedInput === 'y') {
                resolve(true);
            } else if (formattedInput === 'n') {
                resolve(false);
            } else {
                console.log('Please input a valid character.');
                resolve(askQuestion(question)); // 递归调用直到获取有效输入
            }
        });
    });
}

async function updateNewItems(wu: WikiUploader): Promise<void> {
    if (await askQuestion('Should update new items?(Y/n)?')) {
        const gameItems = await wu.getGameItemNotUploaded();
        if (gameItems.length === 0) {
            console.log('No new item');
        } else {
            for (const gameItem of gameItems) {
                if (gameItem.type === 'Character') {
                    console.log(await wu.createCharacterPage(gameItem.id));
                    console.log(await wu.uploadImages(gameItem));
                } else if (gameItem.type === 'Poster') {
                    console.log(await wu.createPosterPage(gameItem.id));
                    console.log(await wu.uploadImages(gameItem));
                }
            }
        }
    }
}

async function checkAndUploadImages(wu: WikiUploader): Promise<void> {
    if (await askQuestion('Do you want to check images not uploaded and upload them?(Y/n)?')) {
        console.log(await wu.uploadWantedImages());
    }
}

async function main() {
    const wikiClient = await initializeWikiClient();
    const wu = new WikiUploader(wikiClient);

    await updateNewItems(wu);
    await checkAndUploadImages(wu);

    rl.close();
}

main().catch((err) => {
    console.error('Error:', err);
    process.exit(1);
});
