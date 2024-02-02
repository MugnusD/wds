"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * This exported method return a wrapped axios instance, which retains a CookieJar
 * to ensure consistency across multiply HTTP requests.
 *
 * 该脚本暴露的方法返回一个 axios 实例的包装、具有一个 CookieJar，
 * 从而可以保证多次 HTTP 请求的连贯性。
 */
var axios_1 = __importDefault(require("axios"));
var tough_cookie_1 = require("tough-cookie");
var axios_cookiejar_support_1 = require("axios-cookiejar-support");
/**
 * Create a wrapped axios instance.
 */
function createWikiClient() {
    var jar = new tough_cookie_1.CookieJar();
    return (0, axios_cookiejar_support_1.wrapper)(axios_1.default.create({ jar: jar }));
}
exports.default = createWikiClient;
