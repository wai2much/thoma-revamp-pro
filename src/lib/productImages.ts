// Product image imports - map database image_url to actual assets
import hausNoir100ml from '@/assets/products/haus-noir-100ml-label.png';
import m3Loing100ml from '@/assets/products/m3-loing-100ml-label.png';
import nSkrrt100ml from '@/assets/products/n-skrrt-100ml-label.png';
import gtrGod100ml from '@/assets/products/gtr-god-100ml-label.png';
import brokie100ml from '@/assets/products/911-brokie-100ml-label.png';
import amgBloom100ml from '@/assets/products/amg-bloom-100ml-label.png';

import hausNoir250ml from '@/assets/products/haus-noir-250ml-starry.png';
import m3Loing250ml from '@/assets/products/m3-loing-250ml-starry.png';
import nSkrrt250ml from '@/assets/products/n-skrrt-250ml-starry.png';
import gtrGod250ml from '@/assets/products/gtr-god-250ml-starry.png';
import brokie250ml from '@/assets/products/911-brokie-250ml-starry.png';
import amgBloom250ml from '@/assets/products/amg-bloom-250ml-starry.png';

// Map image filenames from database to actual imported assets
const imageMap: Record<string, string> = {
  'haus-noir-100ml-label.png': hausNoir100ml,
  'm3-loing-100ml-label.png': m3Loing100ml,
  'n-skrrt-100ml-label.png': nSkrrt100ml,
  'gtr-god-100ml-label.png': gtrGod100ml,
  '911-brokie-100ml-label.png': brokie100ml,
  'amg-bloom-100ml-label.png': amgBloom100ml,
  'haus-noir-250ml-starry.png': hausNoir250ml,
  'm3-loing-250ml-starry.png': m3Loing250ml,
  'n-skrrt-250ml-starry.png': nSkrrt250ml,
  'gtr-god-250ml-starry.png': gtrGod250ml,
  '911-brokie-250ml-starry.png': brokie250ml,
  'amg-bloom-250ml-starry.png': amgBloom250ml,
};

export function getProductImage(imageUrl: string | null): string | null {
  if (!imageUrl) return null;
  
  // If it's already a full URL, return as-is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Look up in our image map
  return imageMap[imageUrl] || null;
}
