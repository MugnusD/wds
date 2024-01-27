const cf = require('./clientFactory.js');
const fs = require('fs');
const FormData = require('form-data');


class WikiClient {
    constructor(sessData, url = 'https://wiki.biligame.com/worlddaistar/api.php') {
        if (!sessData) {
            throw new Error('必须提供 SESSDATA 来初始化!');
        }

        // client 是一个 axios 实例，可以保证请求的连续，但是依然要在方法中手动加入 SEESDATA。实例化需要输入这个信息。
        this.client = cf();
        this.sessData = sessData;
        this.url = url;
        // tokenPromise 是一个期约，用于获取 CSRFToken，任何方法都应该是异步的，使用 await 来解包这个 token。
        this.tokenPromise = this.initialToken();
    }

    /**
     * 返回一个 CSRFToken 的期约，用于任何 API 操作。
     *
     * @returns {Promise<string>}
     */
    async initialToken() {
        try {
            const response = await this.client.get(this.url + '?action=query&meta=tokens&format=json', {
                headers: {
                    'Cookie': `SESSDATA=${this.sessData}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            return response.data.query.tokens.csrftoken;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    /**
     * action=edit。这个方法较为可靠，因此返回值不提供太多额外信息。
     *
     * @param {string} pageTitle 标题
     * @param {string} text 正文文本
     * @param {number} section 段落
     * @param {boolean} nocreate
     * @param {string} summary
     * @returns {Promise<string>}
     */
    async editPage(pageTitle, text, section = 0, nocreate = false,summary = '自动生成') {
        try {
            const token = await this.tokenPromise;
            const params = new URLSearchParams();

            params.append('action', 'edit');
            params.append('title', pageTitle);
            params.append('text', text);
            params.append('summary', summary);
            params.append('token', token);
            params.append('format', 'json');

            if (section !== 0) {
                params.append('section', section.toString());
            }

            if (nocreate) {
                params.append('nocreate', nocreate.toString());
            }

            const response = await this.client.post(this.url, params, {
                    headers: {
                        'Cookie': `SESSDATA=${this.sessData}`,
                    },
                });
            if (response.data.edit.result === 'Success') {
                return `${pageTitle} 编辑成功`;
            } else {
                return `${pageTitle} 编辑失败`;
            }
        } catch (e) {
            console.log(e);
        }
    }

    async uploadFile(fileName, localFilePath, ignoreWarning) {
        try {
            const token = await this.tokenPromise;
            const fileStream = fs.createReadStream(localFilePath);
            const formData = new FormData();

            formData.append('action', 'upload');
            formData.append('filename', fileName);
            formData.append('token', token);
            formData.append('text', '上传测试');
            formData.append('file', fileStream);
            formData.append('format', 'json');
            formData.append('ignorewarnings', ignoreWarning); // 记得删除掉

            const response = await this.client.post(this.url, formData,
                {
                    headers: {
                        'Cookie': `SESSDATA=${this.sessData}`,
                        ...formData.getHeaders(),
                    }
                });

            return response.data;
        } catch (e) {
            return e;
        }
    }
}

module.exports = WikiClient;

if (require.main === module) {
    const sessData = '6b7b18e8%2C1721491941%2C2fbe1%2A11CjAf0tEwI5uvWxy3rQERNXmuVL2ZkUkL1Eo7wxPycgo-qsSRE19_WV7tD-lfyidPAoISVk9BODE5VmE1TjIxTkpIaWJQeTdqYkk4SEEwRUZ3eHc0d3ItM3ItOURmdnlNb3BaZGRpSlJNRElSY1lFX1NyVVp1b25sWVhOMVVVX19tSDRndm5WN2tBIIEC';
    const wc = new WikiClient(sessData);

    const path = `E:\\html_code\\src\\charactercardtextures_assets_charactercardtextures\\130010_0\\130010_0.png`;
    wc.uploadFile('Card 130100 0.png', path).then(console.log);
}


