// const { JSDOM } = require('jsdom');
//
// // 创建一个虚拟的浏览器环境
// const dom = new JSDOM();
// const document = dom.window.document;
//
// // 创建一个新的表格元素
// const table = document.createElement('table');
//
// // 创建表格的行和列，并添加到表格中
// for (let i = 0; i < 3; i++) { // 生成三行
//     const row = table.insertRow(); // 创建新的表格行
//
//     for (let j = 0; j < 2; j++) { // 每行两列
//         const cell = row.insertCell(); // 创建新的表格列
//         cell.textContent = 'Row ' + (i + 1) + ', Column ' + (j + 1); // 设置列的文本内容
//     }
// }
//
// // 输出表格的文本形式
// console.log(table.outerHTML);

const regex = /^文件:(Poster|Card)\s((\d{6})\s(\d)?)\.png/;
const match = regex.exec('文件:Card 130350 0.png');
console.log(match);
const [title, type, fileName, id, suffix] = match;
console.log(title, type, fileName, id, suffix);


//   '文件:Card 130350 0.png',
//   'Card',
//   '130350 0',
//   '130350',