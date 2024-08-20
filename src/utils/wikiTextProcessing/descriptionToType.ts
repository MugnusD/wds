export type TypeMap = Record<string, RegExp>;

export function descriptionToType(description: string, map: TypeMap): string {
    for(let [typeName, typeRegex] of Object.entries(map)) {
        if (typeRegex.test(description)) {
            return typeName;
        }
    }
}