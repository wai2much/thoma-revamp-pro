import { removeBackground, loadImage } from '../src/lib/backgroundRemoval';
import * as fs from 'fs';
import * as path from 'path';

async function processLogo() {
  try {
    // Read the logo file
    const logoPath = path.join(__dirname, '../src/assets/haus-logo.png');
    const logoBuffer = fs.readFileSync(logoPath);
    const logoBlob = new Blob([logoBuffer]);
    
    // Load image
    const img = await loadImage(logoBlob);
    
    // Remove background
    console.log('Removing background...');
    const processedBlob = await removeBackground(img);
    
    // Convert blob to buffer and save
    const arrayBuffer = await processedBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const outputPath = path.join(__dirname, '../src/assets/haus-logo-nobg.png');
    fs.writeFileSync(outputPath, buffer);
    
    console.log('Logo processed successfully!');
  } catch (error) {
    console.error('Error processing logo:', error);
  }
}

processLogo();
