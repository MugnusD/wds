import sharp from "sharp";
import fs from "fs";

export const generateSprite: (inputs: string[], imageSize: number, outputFilePath: string, outputJsonFilePath: string, resize?: number, backgroundWhite?: boolean) => Promise<void> = async (inputs, imageSize, outputFilePath, outputJsonFilePath, resize = 1, backgroundWhite = false) => {
    const numImages = inputs.length;
    const numColumns = Math.ceil(Math.sqrt(numImages));

    const spriteWidth = numColumns * imageSize;
    const spriteHeight = Math.ceil(numImages / numColumns) * imageSize;

    // blank canvas
    const sprite = sharp({
        create: {
            width: spriteWidth,
            height: spriteHeight,
            channels: 4,
            background:backgroundWhite ? {r: 249, g: 250, b: 251, alpha: 0.75} : {r: 0, g: 0, b: 0, alpha: 0},
        }
    });

    const compositeInput: { input: Buffer, left: number, top: number }[] = [];
    const positionData: Record<string, { x: number, y: number }> = {};

    const scale = resize > 1 ? 1 : resize;

    for (let i = 0; i < numImages; i++) {
        const inputFile = inputs[i];

        const x = (i % numColumns) * imageSize;
        const y = Math.floor(i / numColumns) * imageSize;

        // 预处理图像，调整大小
        const resizedImageBuffer = await sharp(inputFile)
            .resize({
                width: Math.ceil(imageSize * scale),
                height: Math.ceil(imageSize * scale),
                fit: sharp.fit.contain,
                background:  {r: 0, g: 0, b: 0, alpha: 0},
            })
            .toBuffer();

        const bias = imageSize * (1 - scale) / 2;

        // sprite.composite([{input: inputFile, left: x, top: y}]);
        compositeInput.push({input: resizedImageBuffer, left: Math.ceil(x + bias), top: Math.ceil(y + bias)});

        const regex = /(\d{6}(_[01])?)\.png$/;
        const match = inputFile.match(regex);

        positionData[match[1]] = {x: x, y: y};
    }

    sprite.composite(compositeInput);
    await sprite.webp().toFile(outputFilePath);

    if (outputJsonFilePath) {
        fs.writeFileSync(outputJsonFilePath, JSON.stringify(positionData, null, 2), 'utf-8');
    }
};