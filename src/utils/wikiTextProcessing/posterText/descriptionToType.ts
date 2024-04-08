import {TypeMap} from "./posterAbilityTypeMap";

export function descriptionToType(description: string, map: TypeMap): string {
    for(let [typeName, typeRegex] of Object.entries(map)) {
        if (typeRegex.test(description)) {
            return typeName;
        }
    }
}