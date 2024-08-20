interface AccessoryDetail {
    id: number;
    name: string;
    rarity: string;
    effects: AccessoryEffectDetail[];
    randomEffects: AccessoryEffectDetail[];
}
interface AccessoryEffectDetail {
    name: string;
    description: string;
    descriptionChinese: string;
}