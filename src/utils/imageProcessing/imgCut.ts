import sharp from "sharp";
import fs from "node:fs/promises";
import path from "path";

export async function imgCut(inputDir: string, outputDir: string): Promise<void> {
    try {
        const files = await fs.readdir(inputDir);

        for (const file of files) {
            const inputFilePath = path.join(inputDir, file);
            const outputFilePath = path.join(outputDir, file);

            const metadata = await sharp(inputFilePath).metadata();
            const left = Math.round(metadata.width * 0.17);
            const top = Math.round(metadata.height * 0.155);
            const newWidth = Math.round(metadata.width * 0.655);
            const newHeight = Math.round(metadata.height * 0.78);

            await sharp(inputFilePath)
                .extract({left, top, width:newWidth, height:newHeight})
                .toFile(outputFilePath);

            console.log(`${outputFilePath} -> ${inputFilePath} converted successfully`);
        }

        console.log('All converted!');
    } catch (e) {
        console.log('Error in pngToWebp', e);
    }
    // 800 * 450
    // 136 70
    // 663 421
}