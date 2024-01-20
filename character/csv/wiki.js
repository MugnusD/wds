const fs = require('fs');
const csv = require('csv-parser');

const filePath = 'character.csv';
const rows = [];

try {
    const data = fs.readFileSync(filePath, 'utf-8');

    csv({ separator: ',' })
        .on('data', (row) => {
            // 将每一行的数据转换为对象
            const rowData = {};
            Object.keys(row).forEach((key) => {
                rowData[key.trim()] = row[key].trim();
            });
            rows.push(rowData);
        })
        .on('end', () => {
            // 处理解析后的 JavaScript 对象数组
            console.log(rows);
        })
        .write(data);

} catch (err) {
    console.error('Error reading file:', err);
}

console.log(rows);