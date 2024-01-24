const fs = require('fs');

const biliWiki = 'https://wiki.biligame.com/worlddaistar/api.php';
const wiki = 'https://zh.wikipedia.org/wiki/Wikipedia:%E6%B2%99%E7%9B%92/api.php';

function getAuthManagerInfo(url) {
    return new Promise((resolve, reject) => {
        fetch(url + '?action=query&meta=authmanagerinfo&amirequestsfor=login&format=json&utf8=1', {
            method: 'GET',
            credentials: 'include',
        })
            .then(response => response.json())
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
}

function getLoginToken(url) {
    return new Promise((resolve, reject) => {
        fetch(url + '?action=query&meta=tokens&type=login&format=json', {
            method: 'GET',
            credentials: 'include',
        })
            .then(response => response.json())
            .then(data => {
                const loginToken = data.query.tokens.logintoken;
                resolve(loginToken);
            })
            .catch(error => {
                reject(error);
            });
    });
}

function getCSRFToken(url) {
    return new Promise(((resolve, reject) => {
        fetch(url + '?action=query&meta=tokens&format=json', {
            method: 'Get',
            headers: {
                'Cookie': 'gamecenter_wiki_UserGroups=bilibili; buvid4=E8625D4F-A221-F823-57C7-48C66A926DB318239-024010709-pq8xfCIb9zWKsuiPfLWZpw%3D%3D; b_nut=1705847074; buvid3=A0C9A237-7B87-52B1-3BF0-67881F4E151575441infoc; Hm_lvt_cb50e488eca598646f26b3bf09b83ada=1705847076; buvid_fp=48fd5a031c8f7b140e2c66626f46b065; bsource=search_google; bili_jct=9b7da4de58832cdf29e5e82b3b74ff06; DedeUserID=30315258; DedeUserID__ckMd5=fe1eec1c33f5bde3; sid=octsov65; VEE=wikitext; b_lsid=38D1D9A3_18D392D961D; Hm_lpvt_cb50e488eca598646f26b3bf09b83ada=1706062006'
            }
        })
            .then(response => response.json())
            .then(data => resolve(data))
            .catch(error => reject(error))
    }));
}

const url = biliWiki;


getLoginToken(url)
    .then(loginToken => {
        console.log(loginToken);

        const body = new URLSearchParams({
            'action': 'login',
            'lgtoken': loginToken,
            'lgname': '30315258@bot',
            'lgpassword': 'eciv3sffi7h0egro8upgv1lhkk4nv47t',
            'format': 'json',
        });
        // 使用获取到的登录令牌构建登录请求
        fetch(url, {
            method: 'POST',
            credentials: 'include',
            body: body,
        })
            .then(response => response.json())
            .then(data => {
                    console.log('登录响应：', data);
                }
            )
            .catch(error => console.error('登录时错误：', error));
    })
    .catch(error => {
        console.error('获取 login 令牌时错误：', error);
    });



