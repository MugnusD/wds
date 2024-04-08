export type TypeMap = Record<string, RegExp>;

export const posterLeaderAbilityTypeMap: TypeMap = {
    Sirius: /天狼星/,
    Eden: /Eden/,
    Gingaza: /银河座/,
    Denki: /剧团电姬/,
    Cute: /怜属性/,
    Cool: /凛属性/,
    Colorful: /彩属性/,
    Cheerful: /阳属性/,
    All: /所有演员/,
};

export const posterNormalAbilityTypeMap: TypeMap = {
    peUp: /自身的演技力提升/,
    voUp: /自身的歌唱力提升/,
    exUp: /自身的表现力提升/,
    coUp: /自身的集中力提升/,

    peScore: /获得现在分数的/,
    voScore: /获得自身歌唱力/,
    exScore: /获得自身表现力/,
    coScore: /获得自身集中力/,

    lightUp: /Sense所给予的「光」给予数量增加/,
    lightGain: /公演开始时，给予.*个/,
    gaugeUp: /Sense中的Principal Gauge获得量提升/,
    gaugeGain: /公演开始时，获得.*点Principal Gauge/,
    lifeUp: /Sense发动之后，回复.*点血量/,
    lifeGain: /公演开始时，提升.*点血量/,
    ctDown: /CT/,

    // 未匹配返回，必须保持这个在最后
    special: /.*/,
}

