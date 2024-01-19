const fs = require('fs');

/**
 * @typedef {Object} Sense
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {string} type
 * @property {Array} preEffects
 * @property {Array} branches
 * @property {number} acquirableGauge
 * @property {number} acquirableScorePercent
 * @property {number} scoreUpPerLevel
 * @property {number} lightCount
 * @property {number} coolTime
 * @property {string} branchCondition1
 * @property {null|any} conditionValue1
 * @property {string} branchCondition2
 * @property {null|any} conditionValue2
 */

const senseData = fs.readFileSync('SenseMaster.json', 'utf-8');
/** @type {Sense[]} */
const senseArray = JSON.parse(senseData);

let descriptionArray = senseArray.map(_ => _.description);
let descriptionSet = new Set(descriptionArray);

console.log(descriptionSet);