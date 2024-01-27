const fs = require('fs');
const path = require('path');
const wikiClient = require('./utils/http/wikiClient');

const sessData = '6b7b18e8%2C1721491941%2C2fbe1%2A11CjAf0tEwI5uvWxy3rQERNXmuVL2ZkUkL1Eo7wxPycgo-qsSRE19_WV7tD-lfyidPAoISVk9BODE5VmE1TjIxTkpIaWJQeTdqYkk4SEEwRUZ3eHc0d3ItM3ItOURmdnlNb3BaZGRpSlJNRElSY1lFX1NyVVp1b25sWVhOMVVVX19tSDRndm5WN2tBIIEC';
const biliWiki = 'https://wiki.biligame.com/worlddaistar/api.php';

const rootFolder = 'E:/html_code/src/charactercardtextures_assets_charactercardtextures';
const matchingFiles = [];

/**
 * 遍历文件，填充 matchingFiles
 * @param folderPath
 */
function traversFolder (folderPath) {
    const files = fs.readdirSync(folderPath);
    files.forEach(file => {
        const filePath = path.join(folderPath, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            traversFolder(filePath);
        } else {
            const regex = /^(\d{6})_([01])\.png$/;
            const result = regex.exec(file);
            if (regex.test(file)) {
                matchingFiles.push({
                    uploadFileName: 'Card ' + result[1] + ' ' + result[2] + '.png',
                    localPath: filePath,});
            }
        }
    });
}

function uploadAllPic() {
    const wc = new wikiClient(sessData);
    traversFolder(rootFolder);

    function uploadFileSequentially(index) {
        if (index < matchingFiles.length) {
            const fileInfo = matchingFiles[index];

            wc.uploadFile(fileInfo.uploadFileName, fileInfo.localPath)
                .then(data => {
                    index += 1;
                    console.log(`文件 ${index} 成功；结果为： ${data.upload.result}`);
                    setTimeout(() => uploadFileSequentially(index), 1000);
                })
                .catch(data => {
                    index += 1;
                    console.log(`文件 ${index} 失败`);
                    setTimeout(() => uploadFileSequentially(index), 1000);
                })
        }
    }

    uploadFileSequentially(0);
}

uploadAllPic();

// traversFolder(rootFolder);
// fs.writeFileSync('./fileList.json', JSON.stringify(matchingFiles, null, 2), 'utf-8');