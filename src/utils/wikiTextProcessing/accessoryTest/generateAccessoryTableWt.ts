import convertUnityDescriptionToHtml from "../unityToHtml/convertUnityDescriptionToHtml";

export const generateAccessoryTableWt: (accessories: AccessoryDetail[]) => string =  (accessories) => {
    const content = accessories
        .sort((a,b) => b.rarity.length - a.rarity.length)
        .map(accessory => getAccessoryWt(accessory))
        .join("\n");

    return `
本页面记录了所有的饰品并加以筛选功能。
<span class="plainlinks">[https://wiki.biligame.com/worlddaistar/index.php?title=%E9%A5%B0%E5%93%81%E5%88%97%E8%A1%A8&action=purge 点击这里刷新]</span>以获取最新信息。
<table class="wikitable" style="width:100%">
<tr><th style="width:80px">查看全部</th>
<td>{{筛选项|0|角色|查看全部}}</td></tr>
<tr><th>稀有度</th>
<td>{{筛选项|1|SSR}} {{筛选项|1|SR}} {{筛选项|1|R}}</td></tr>
<tr><th>技能类型</th>
<td>{{筛选项|6|Performance|演技力提升}} {{筛选项|6|PrincipalGain|初始P.Gauge提升}} {{筛选项|6|Vocal|歌唱力提升}} {{筛选项|6|Expression|表现力提升}} {{筛选项|6|Concentration|集中力提升}} {{筛选项|6|Score|基础分数提升}} {{筛选项|6|Reward|报酬量上升}} {{筛选项|6|PrincipalUp|获得P.Gauge提升}}</td></tr>
<tr><th>额外技能类型</th>
<td>{{筛选项|5|Extra|单项能力提升}} {{筛选项|5|Principal|初始P.Gauge提升}} {{筛选项|5|Life|初始血量提升}} {{筛选项|5|CT|CT缩短}} {{筛选项|5|Light|获得光增加}} {{筛选项|5|SP|初始SP光}} {{筛选项|5|None|无额外技能}}</td></tr>
<tr><th>装备属性</th>
<td>{{筛选项|4|怜}} {{筛选项|4|凛}} {{筛选项|4|彩}} {{筛选项|4|阳}} {{筛选项|4|None|无装备属性条件}}</td></tr>
<tr><th>装备剧团</th>
<td>{{筛选项|3|天狼星}} {{筛选项|3|Eden}} {{筛选项|3|银河座}} {{筛选项|3|剧团电姬}} {{筛选项|3|None|无装备剧团条件}}</td></tr>
<tr><th>装备角色</th>
<td><div>{{筛选项|2|凤心菜}} {{筛选项|2|静香}} {{筛选项|2|卡特莉娜·格利贝尔}} {{筛选项|2|新妻八惠}} {{筛选项|2|柳场潘达}} {{筛选项|2|流石知冴}}</div>
<div>{{筛选项|2|连尺野初魅}} {{筛选项|2|乌森大黑}} {{筛选项|2|舍人仁花子}} {{筛选项|2|万容}} {{筛选项|2|笔岛时雨}}</div>
<div>{{筛选项|2|千寿历}} {{筛选项|2|拉莫娜·沃尔芙}} {{筛选项|2|王雪}} {{筛选项|2|莉莉亚·库尔特贝}} {{筛选项|2|与那国绯花里}}</div>
<div>{{筛选项|2|千寿伊吕波}} {{筛选项|2|白丸美兔}} {{筛选项|2|阿岐留卡米拉}} {{筛选项|2|猫足蕾}} {{筛选项|2|本巢叶羽}}</div>
<div>{{筛选项|2|None|无装备角色条件}}</div></td></tr>
</table>
{| class="wikitable" border="1" cellspacing="1" cellpadding="5" style="text-align:center" width="100%"
! width="10%" style="position:-webkit-sticky;position:sticky;top:0px;" |饰品图标
! width="15%" style="position:-webkit-sticky;position:sticky;top:0px;" |饰品名称
! width="5%" style="position:-webkit-sticky;position:sticky;top:0px;" |稀有度
! width="35%" style="position:-webkit-sticky;position:sticky;top:0px;" |饰品技能
! width="35%" style="position:-webkit-sticky;position:sticky;top:0px;" |额外技能
${content}
|}
{{其他索引}}`
}

const getAccessoryWt: (accessory: AccessoryDetail) => string = (accessory) => {
    const imageName = `Accessory ${accessory.id}.png`;
    const name = accessory.name;
    const rarity = accessory.rarity;
    const _effect = accessory.effects[0].descriptionChinese;
    const effect = convertUnityDescriptionToHtml(_effect);

    let effectType: string;

    let secondEffect: string;

    if (accessory.effects[1]) {
        const _secondEffect = accessory.effects[1].descriptionChinese;
        secondEffect = convertUnityDescriptionToHtml(_secondEffect);
    } else if (accessory.randomEffects[0]) {
        const _secondEffect = accessory.randomEffects[0].descriptionChinese;
        secondEffect = convertUnityDescriptionToHtml(_secondEffect);
    } else {
        secondEffect = '';
    }

    return `
{{饰品信息
|图片=${imageName}
|名称=${name}
|稀有度=${rarity}
|技能=${effect}
|技能类型=${effectType}
|额外技能=${secondEffect}
}}`
}
