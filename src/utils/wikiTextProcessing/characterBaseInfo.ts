export type CharacterBaseInfoType = {
    id: number,
    name: string,
    firstName: string,
    chineseName: string,
    styledName: string,
}

const characterBaseInfoArray: CharacterBaseInfoType[] = [
    {
        id: 101,
        name: "鳳ここな",
        firstName: "ここな",
        chineseName: "凤心菜",
        styledName: '<span style="color: #F07B7C;font-weight: bold;text-shadow: 1px 1px 0 #888">{name}</span>'
    },
    {
        id: 102,
        name: "静香",
        firstName: "静香",
        chineseName: "静香",
        styledName: '<span style="color: #6F93E7;font-weight: bold;text-shadow: 1px 1px 0 #888">{name}</span>'
    },
    {
        id: 103,
        name: "カトリナ・グリーベル",
        firstName: "カトリナ",
        chineseName: "卡特莉娜·格利贝尔",
        styledName: '<span style="color: #FFB83C;font-weight: bold;text-shadow: 1px 1px 0 #888">{name}</span>'
    },
    {
        id: 104,
        name: "新妻八恵",
        firstName: "八恵",
        chineseName: "新妻八惠",
        styledName: '<span style="color: #C7BEF6;font-weight: bold;text-shadow: 1px 1px 0 #888">{name}</span>'
    },
    {
        id: 105,
        name: "柳場ぱんだ",
        firstName: "ぱんだ",
        chineseName: "柳场潘达",
        styledName: '<span style="color: #70DCF3;font-weight: bold;text-shadow: 1px 1px 0 #888">{name}</span>'
    },
    {
        id: 106,
        name: "流石知冴",
        firstName: "知冴",
        chineseName: "流石知冴",
        styledName: '<span style="color: #F3AF9C;font-weight: bold;text-shadow: 1px 1px 0 #888">{name}</span>'
    },
    {
        id: 201,
        name: "連尺野初魅",
        firstName: "初魅",
        chineseName: "连尺野初魅",
        styledName: '<span style="color: #998EDD;font-weight: bold;text-shadow: 1px 1px 0 #888">{name}</span>'
    },
    {
        id: 202,
        name: "烏森大黒",
        firstName: "大黒",
        chineseName: "乌森大黑",
        styledName: '<span style="color: #505053;font-weight: bold;text-shadow: 1px 1px 0 #888">{name}</span>'
    },
    {
        id: 203,
        name: "舎人仁花子",
        firstName: "仁花子",
        chineseName: "舍人仁花子",
        styledName: '<span style="color: #4195DD;font-weight: bold;text-shadow: 1px 1px 0 #888">{name}</span>'
    },
    {
        id: 204,
        name: "萬容",
        firstName: "容",
        chineseName: "万容",
        styledName: '<span style="color: #B59158;font-weight: bold;text-shadow: 1px 1px 0 #888">{name}</span>'
    },
    {
        id: 205,
        name: "筆島しぐれ",
        firstName: "しぐれ",
        chineseName: "笔岛时雨",
        styledName: '<span style="color: #B5303C;font-weight: bold;text-shadow: 1px 1px 0 #888">{name}</span>'
    },
    {
        id: 301,
        name: "千寿暦",
        firstName: "暦",
        chineseName: "千寿历",
        styledName: '<span style="color: #4E5BA8;font-weight: bold;text-shadow: 1px 1px 0 #888">{name}</span>'
    },
    {
        id: 302,
        name: "ラモーナ・ウォルフ",
        firstName: "ラモーナ",
        chineseName: "拉莫娜·沃尔芙",
        styledName: '<span style="color: #FF9B5E;font-weight: bold;text-shadow: 1px 1px 0 #888">{name}</span>'
    },
    {
        id: 303,
        name: "王雪",
        firstName: "雪",
        chineseName: "王雪",
        styledName: '<span style="color: #F05A5A;font-weight: bold;text-shadow: 1px 1px 0 #888">{name}</span>'
    },
    {
        id: 304,
        name: "リリヤ・クルトベイ",
        firstName: "リリヤ",
        chineseName: "莉莉亚·库尔特贝",
        styledName: '<span style="color: #83D3D6;font-weight: bold;text-shadow: 1px 1px 0 #888">リリヤ・クルトベイ</span>'
    },
    {
        id: 305,
        name: "与那国緋花里",
        firstName: "緋花里",
        chineseName: "与那国绯花里",
        styledName: '<span style="color: #E8557E;font-weight: bold;text-shadow: 1px 1px 0 #888">{name}</span>'
    },
    {
        id: 401,
        name: "千寿いろは",
        firstName: "いろは",
        chineseName: "千寿伊吕波",
        styledName: '<span style="color: #BAC4D7;font-weight: bold;text-shadow: 1px 1px 0 #888">{name}</span>'
    },
    {
        id: 402,
        name: "白丸美兎",
        firstName: "美兎",
        chineseName: "白丸美兔",
        styledName: '<span style="color: #FFA866;font-weight: bold;text-shadow: 1px 1px 0 #888">{name}</span>'
    },
    {
        id: 403,
        name: "阿岐留カミラ",
        firstName: "カミラ",
        chineseName: "阿岐留卡米拉",
        styledName: '<span style="color: #C0F297;font-weight: bold;text-shadow: 1px 1px 0 #888">{name}</span>'
    },
    {
        id: 404,
        name: "猫足蕾",
        firstName: "蕾",
        chineseName: "猫足蕾",
        styledName: '<span style="color: #AE7AD4;font-weight: bold;text-shadow: 1px 1px 0 #888">{name}</span>'
    },
    {
        id: 405,
        name: "本巣叶羽",
        firstName: "叶羽",
        chineseName: "本巢叶羽",
        styledName: '<span style="color: #FF92B1;font-weight: bold;text-shadow: 1px 1px 0 #888">{name}</span>'
    },
    {
        id: 901,
        name: "高海千歌",
        firstName: "千歌",
        chineseName: "高海千歌",
        styledName: '<span style="color: #FF92B1;font-weight: bold;text-shadow: 1px 1px 0 #888">{name}</span>',
    },
    {
        id: 902,
        name: "桜内梨子",
        firstName: "梨子",
        chineseName: "樱内梨子",
        styledName: '<span style="color: #FF92B1;font-weight: bold;text-shadow: 1px 1px 0 #888">{name}</span>',
    },
    {
        id: 901,
        name: "高海千歌",
        firstName: "千歌",
        chineseName: "高海千歌",
        styledName: '<span style="color: #FF92B1;font-weight: bold;text-shadow: 1px 1px 0 #888">{name}</span>',
    },
    {
        id: 904,
        name: "黒澤ダイヤ",
        firstName: "ダイヤ",
        chineseName: "黑泽黛雅",
        styledName: '<span style="color: #FF92B1;font-weight: bold;text-shadow: 1px 1px 0 #888">{name}</span>',
    },
    {
        id: 906,
        name: "津島善子",
        firstName: "善子",
        chineseName: "津島善子",
        styledName: '<span style="color: #FF92B1;font-weight: bold;text-shadow: 1px 1px 0 #888">{name}</span>',
    },
    {
        id: 901,
        name: "黒澤ルビィ",
        firstName: "ルビィ",
        chineseName: "黑泽露比",
        styledName: '<span style="color: #FF92B1;font-weight: bold;text-shadow: 1px 1px 0 #888">{name}</span>',
    }
];

export {characterBaseInfoArray};