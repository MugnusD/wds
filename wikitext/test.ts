import {type} from "os";

const fs = require('fs');

const data = fs.readFileSync('./effect.json', 'utf-8');
const objects = JSON.parse(data);

interface effect {
    type: string,
    range: string,
    calculationTypes: string[],
}

const effectArray: effect[] = [];
objects.forEach(effectObject => {
    const effect = {type: effectObject.type, range: effectObject.range, calculationType: effectObject.calculationType};
    const effectGroup = effectArray.find(_ => _.type === effect.type && _.range === effect.range);

    if (!effectGroup) {
        effectArray.push({
                type: effect.type,
                range: effect.range,
                calculationTypes: [effect.calculationType,]
            }
        )
    } else {
        if (!effectGroup.calculationTypes.includes(effect.calculationType))
            effectGroup.calculationTypes.push(effect.calculationType);
    }
});


console.log(effectArray);