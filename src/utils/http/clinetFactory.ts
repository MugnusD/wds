/*
 * This exported method return a wrapped axios instance, which retains a CookieJar
 * to ensure consistency across multiply HTTP requests.
 *
 * 该脚本暴露的方法返回一个 axios 实例的包装、具有一个 CookieJar，
 * 从而可以保证多次 HTTP 请求的连贯性。
 */
import axios, {AxiosInstance} from 'axios';
import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';

/**
 * Create a wrapped axios instance.
 */
export default function createWikiClient(): AxiosInstance {
    const jar = new CookieJar();
    return wrapper(axios.create({ jar }));
}
