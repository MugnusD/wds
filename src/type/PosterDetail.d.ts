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
    type: CharacterOrPosterType;
    stories: PosterStory[];
}
declare interface PosterAbilityDetail {
    name: string;
    description: string;
    descriptionChinese: string;
    effectDetails: number[][];
    type: string;
    releaseLevelAt: number;
}

declare interface PosterStory {
    id: number;
    posterMasterId: number;
    episodeType: string;
    description: string;
    order: number;
    characterBaseMasterId?: number;
}

declare enum CharacterOrPosterType {
    NONE = "None",
    INIT = "Init",
    STORY_REWARD = "StoryReward",
    EVENT_EXCHANGE = "EventExchange",
    NORMAL = "Normal",
    TIME_LIMITED = "TimeLimited",
    FESTIVAL_LIMITED = "FestivalLimited",
    CLUB_LIMITED = "ClubLimited"
}
