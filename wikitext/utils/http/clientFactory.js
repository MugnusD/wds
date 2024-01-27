/*
 * This exported method return a wrapped axios instance, which retains a CookieJar
 * to ensure consistency across multiply HTTP requests.
 *
 * 该脚本暴露的方法返回一个 axios 实例的包装、具有一个 CookieJar，
 * 从而可以保证多次 HTTP 请求的连贯性。
 */
const axios = require('axios').default;
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');

/**
 * Create a wrapped axios instance.
 *
 * @returns {AxiosInstance}
 */
module.exports = function() {
    const jar = new CookieJar();
    return wrapper(axios.create({jar}));
}

