interface PosterDetail {
    id: number;
    name: string;
    rarity: string;
    pronounceName: string;
    appearanceCharacterBases: string[];
    appearanceCharacterBasesChinese: string[];
    displayStartAt: Date;
    abilities: PosterAbilityDetail[];
    event: string;
    gacha: string;
    type: GachaType;
}
interface PosterAbilityDetail {
    name: string;
    description: string;
    descriptionChinese: string;
    effectDetails: number[][];
    type: string;
    releaseLevelAt: number;
}
declare enum GachaType {
    NONE = "None",
    NORMAL = "Normal",
    TIME_LIMITED = "TimeLimited",
    FESTIVAL_LIMITED = "FestivalLimited",
    CLUB_LIMITED = "ClubLimited",
    LIMITED_REOPEN = "LimitedReopen",
    PICKUP = "Pickup",
    SELECT_PICKUP = "SelectPickup",
    FREE = "Free"
}

export {PosterDetail};