import * as fs from 'fs';
import cf from './clinetFactory';
import FormData from "form-data";
import {AxiosInstance} from "axios";

interface EditOptions {
    section?: number;
    nocreate?: boolean;
    createonly?: boolean;
    summary?: string,
    appendtext?: string,
}

export default class WikiClient {
    private readonly client: AxiosInstance;
    // Cookie 中的 sessData，bilibili Wiki 必须这么登录
    private readonly sessData: string;
    // 交互的 Wiki 网址，默认 bwiki wds
    private readonly url: string;

    // tokenPromise 是一个期约，用于获取 CSRFToken，任何方法都应该是异步的，使用 await 来解包这个 token。

    constructor(sessData, url = 'https://wiki.biligame.com/worlddaistar/api.php') {
        this.client = cf();
        this.sessData = sessData;
        this.url = url;
    }

    /**
     * 返回一个 CSRFToken 的期约，用于任何 API 操作。
     */
    async initialToken(): Promise<string> {
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

    public async editPage(pageTitle: string, text: string, options: EditOptions = {}): Promise<string> {
        const {
            section = 0,
            nocreate = false,
            createonly = false,
            summary = '自动生成',
            appendtext = '',
        } = options;

        try {
            const token = await this.initialToken();
            const params = new URLSearchParams();

            params.append('action', 'edit');
            params.append('title', pageTitle);
            params.append('summary', summary);
            params.append('token', token);
            params.append('format', 'json');

            if (section !== 0) {
                params.append('section', section.toString());
            }

            if (nocreate) {
                params.append('nocreate', nocreate.toString());
            }

            if (createonly) {
                params.append('createonly', createonly.toString());
            }

            if (appendtext !== '') {
                params.append('appendtext', appendtext.toString());
            }

            if (text !== '') {
                params.append('text', text.toString());
            }

            if (appendtext === '' && text === '') {
                return `edit ${pageTitle} failed`
            }

            const response = await this.client.post(this.url, params, {
                headers: {
                    'Cookie': `SESSDATA=${this.sessData}`,
                },
            });
            return `edit ${pageTitle} successfully`;
        } catch (e) {
            console.log(e);
        }
    }

    public async uploadFile(fileName: string, localFilePath: string, ignoreWarning: boolean = false): Promise<string> {
        try {
            const token = await this.initialToken();
            const fileStream = fs.createReadStream(localFilePath);
            const formData = new FormData();

            formData.append('action', 'upload');
            formData.append('filename', fileName);
            formData.append('token', token);
            formData.append('text', '自动上传');
            formData.append('file', fileStream);
            formData.append('format', 'json');

            if (ignoreWarning) {
                formData.append('ignorewarnings', ignoreWarning.toString());
            }

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

    public async getPageContent(pageTitle: string): Promise<string | undefined> {
        try {
            const params = new URLSearchParams({
                action: 'parse',
                prop: 'wikitext',
                page: pageTitle,
                format: 'json'
            });
            const response = await this.client.get(this.url + '?' + params.toString());
            if (response.data.parse.wikitext['*']) {
                return response.data.parse.wikitext['*'];
            } else {
                return undefined;
            }
        } catch (e) {
            return e;
        }
    }

    public async getPageTitles(): Promise<string[]> {
        try {
            const params = new URLSearchParams({
                action: 'query',
                list: 'allpages',
                format: 'json',
                aplimit: 'max',
            });
            const response = await this.client.get(this.url + '?' + params.toString());
            return response.data.query.allpages.map(_ => _.title);
        } catch (e) {
            return e;
        }
    }
}

