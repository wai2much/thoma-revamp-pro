export const MEMBER_PRICING = {
  '250ml': { regular: 149, member: 99, discount: 33 },
  '100ml': { regular: 79, member: 55, discount: 30 },
  'Cards': { regular: 39, member: 29, discount: 26 },
  'Clips': { regular: 39, member: 29, discount: 26 },
} as const;

export const getMemberPrice = (productTitle: string, regularPrice: number) => {
  if (productTitle.includes('250ml') || productTitle.toLowerCase().includes("collector")) {
    return MEMBER_PRICING['250ml'].member;
  } else if (productTitle.includes('100ml') || productTitle.toLowerCase().includes("disc")) {
    return MEMBER_PRICING['100ml'].member;
  } else if (productTitle.toLowerCase().includes('cards') || productTitle.toLowerCase().includes('freshener')) {
    return MEMBER_PRICING['Cards'].member;
  } else if (productTitle.toLowerCase().includes('clips') || productTitle.toLowerCase().includes('vent')) {
    return MEMBER_PRICING['Clips'].member;
  }
  
  // Return undefined if no member pricing available
  return undefined;
};

export const isVapeHeadProduct = (vendor?: string) => {
  return vendor?.toUpperCase() === 'VAPE HEAD';
};
