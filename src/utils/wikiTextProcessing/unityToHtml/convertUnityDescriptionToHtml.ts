import {JSDOM} from 'jsdom';

/**
 * 将技能描述转化，包括将 Unity 颜色标签转化为 HTML、给发动条件前面加上回车
 * @param unityString
 */
function convertUnityDescriptionToHtml(unityString: string): string {
    const regex = /<color=(#[0-9A-F]{6})>(.*?)<\/color>/gi;
    // return unityString.replace(regex, '<span style="color: $1">$2</span>');
    const document = new JSDOM().window.document;
    const span = document.createElement('span');

    unityString = unityString.replace(regex, (match, color, text) => {
        span.textContent = text;
        span.style.color = color;
        return span.outerHTML;
    });

    unityString = unityString.replace('◆', '<br />◆');

    return unityString;
}

export default convertUnityDescriptionToHtml;