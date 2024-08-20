import fs from 'node:fs/promises';
import sharp from "sharp";
import path from "path";

export async function pngToWebp(inputDir: string, outputDir: string): Promise<void> {
    try {
        const files = await fs.readdir(inputDir);
        const pngFiles = files.filter(file => file.endsWith('png'));

        for (const file of pngFiles) {
            const inputFilePath = path.join(inputDir, file);
            const outputFilePath = path.join(outputDir, file.replace('.png', '.webp'));

            await sharp(inputFilePath).toFormat('webp').toFile(outputFilePath);
            console.log(`${outputFilePath} -> ${inputFilePath} converted successfully`);
        }

        console.log('All converted!');
    } catch (e) {
        console.log('Error in pngToWebp', e);
    }
}