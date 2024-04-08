interface CharacterDetail {
    id: number;
    name: string;
    rarity: string;
    attribute: string;
    status: CharacterStatusDetail[];
    characterBase: string;
    characterBaseChinese: string;
    starAct: StarActDetail;
    sense: SenseDetail;
    bloomBonuses: BloomBonusDetail[];
    displayStartAt: Date;
    event: string;
    gacha: string;
    episodes: CharacterEpisodeDetail[];
}

interface BloomBonusDetail {
    phase: number;
    descriptions: string[];
    descriptionsChinese: string[];
}

interface SenseDetail {
    descriptions: string[];
    descriptionsChinese: string[];
    type: string;
    lightCount: number;
    acquirableGauge: number;
    coolTime: {
        origin: number;
        bloom: number;
    };
    effectTypes: string[];
}

interface StarActDetail {
    description: string;
    descriptionChinese: string;
    conditions: StarActLightCondition[];
}
interface StarActLightCondition {
    type: string;
    typeChinese: string;
    origin: number;
    bloom: number;
}

interface CharacterEpisodeDetail {
    id: number;
    episodeOrder: string;
}
declare enum CharacterEpisodeStatus {
    NONE = "None",
    FIRST = "First",
    SECOND = "Second"
}

interface CharacterStatusPreset {
    level?: number;
    awakening?: boolean;
    episode?: CharacterEpisodeStatus;
    bloom?: number;
}
declare interface CharacterStatusDetail {
    preset: CharacterStatusPreset;
    status: {
        vocal: number;
        expression: number;
        concentration: number;
    };
}

