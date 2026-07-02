const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputPath = '/home/ulrich/.gemini/antigravity/brain/a6695632-20dd-4819-9f32-a83c0ff96df4/uploaded_image_1_1779897949386.jpg';
const logoInput = '/home/ulrich/.gemini/antigravity/brain/a6695632-20dd-4819-9f32-a83c0ff96df4/uploaded_image_0_1779897949386.png';
const outputDir = path.join(__dirname, 'imgs');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function processImages() {
    const metadata = await sharp(inputPath).metadata();
    const w = Math.floor(metadata.width / 3);
    const h = Math.floor(metadata.height / 2);

    const crops = [
        { name: 'slide1.png', left: 0, top: 0 },
        { name: 'slide2.png', left: w, top: 0 },
        { name: 'slide3.png', left: w * 2, top: 0 },
        { name: 'slide4.png', left: 0, top: h },
        { name: 'slide6.png', left: w, top: h },
        { name: 'slide15.png', left: w * 2, top: h }
    ];

    for (const crop of crops) {
        await sharp(inputPath)
            .extract({ left: crop.left, top: crop.top, width: w, height: h })
            .toFile(path.join(outputDir, crop.name));
        console.log(`Saved ${crop.name}`);
    }

    // Copy logo
    fs.copyFileSync(logoInput, path.join(outputDir, 'logo.png'));
    console.log('Saved logo.png');
}

processImages().catch(console.error);
