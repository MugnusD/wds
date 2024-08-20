import * as fs from 'fs';
import cf from './clinetFactory';
import FormData from "form-data";
import axios, {AxiosInstance} from "axios";

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
    async getCsrfToken(): Promise<string> {
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

    async checkCsrfToken(): Promise<boolean> {
        try {
            const csrfToken = await this.getCsrfToken();
            if (csrfToken === '+\\') return false;
        } catch (e) {
            return false;
        }

        return true;
    }

    public async editPage(pageTitle: string, text: string, options: EditOptions = {}): Promise<string> {
        const {
                  section    = 0,
                  nocreate   = false,
                  createonly = false,
                  summary    = '自动生成',
                  appendtext = '',
              } = options;

        try {
            const token = await this.getCsrfToken();
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
            console.log(response.data);
            return `edit ${pageTitle} successfully`;
        } catch (e) {
            return `edit ${pageTitle} unsuccessfully`;
        }
    }

    public async uploadFile(fileName: string, filePath: string, ignoreWarning: boolean = false, remoteFile: boolean = false): Promise<string> {
        try {
            const token = await this.getCsrfToken();
            const formData = new FormData();

            if (remoteFile) {
                const response = await axios.get(filePath, {responseType: 'stream'});
                formData.append('file', response.data);
            } else {
                const fileStream = fs.createReadStream(filePath);
                formData.append('file', fileStream);
            }

            formData.append('action', 'upload');
            formData.append('filename', fileName);
            formData.append('token', token);
            formData.append('text', '自动上传');
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

            return `上传文件 ${fileName} 成功`;
        } catch (e) {
            return `上传文件 ${fileName} 失败`;
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

    public async getWantedFileTitles() {
        try {
            const params = new URLSearchParams({
                action: 'query',
                list: 'querypage',
                qppage: 'Wantedfiles',
                format: 'json',
                qplimit: '50',
            });
            const response = await this.client.get(this.url + '?' + params.toString());
            const result = response.data.query.querypage.results.map(_ => _.title);
            return result;
        } catch (e) {
            return e;
        }
    }
}

