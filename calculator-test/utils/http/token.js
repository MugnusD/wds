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


