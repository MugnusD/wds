fs = require('fs');

const bloomBonusData = fs.readFileSync("characterBloomBonusGroup.json", 'utf-8');
const bloomBonusGroup = JSON.parse(bloomBonusData);

const bloomBonusArray = bloomBonusGroup.flatMap(it => it.bloomBonuses);
/* 
const bloomBonusDistinct = new Set(bloomBonusArray.map(JSON.stringify));
const element = [...bloomBonusDistinct]
console.log(element.map(JSON.parse)); 
*/

function filterUniqueObject(array, compareFn) {
    const uniqueObjects = [];

    array.forEach(comparedItem => {
        let isUnique = true;

        uniqueObjects.forEach(uniqueItem => {
            if (compareFn(comparedItem, uniqueItem)) {
                isUnique = false;
            }
        });

        if (isUnique) {
            uniqueObjects.push(comparedItem)
        }
    });

    return uniqueObjects;
}

const uniqueElements = filterUniqueObject(bloomBonusArray,
    (obj1, obj2) => obj1.phase === obj2.phase && obj1.description === obj2.description)
    .sort((obj1, obj2) => {
        if (obj1.phase !== obj2.phase) {
            return obj1.phase - obj2.phase;
        }

        const actScorePattern = /演技力(.+)UP/;
        if (actScorePattern.test(obj1.description) && actScorePattern.test(obj2.description)) {
            const obj1Score = (actScorePattern.exec(obj1.description))[1];
            const obj2Score = (actScorePattern.exec(obj2.description))[1];
            return Number.parseInt(obj1Score) - Number.parseInt(obj2Score);
        }

        return obj1.description.localeCompare(obj2.description, "ja-JP");
    })

fs.writeFileSync("bloomUnique.json", JSON.stringify(uniqueElements, null, 2));