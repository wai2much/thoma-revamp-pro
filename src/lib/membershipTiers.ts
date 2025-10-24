export const MEMBERSHIP_TIERS = {
  single: {
    price_id: "price_1SLk5wAjq2ZDgz7I1x1crhci",
    product_id: "prod_TIKlo107LUfRkP",
    name: "Single Pack",
  },
  family: {
    price_id: "price_1SLk6bAjq2ZDgz7IMK9icANm",
    product_id: "prod_TIKmAWTileFjnm",
    name: "Family Pack",
  },
  business: {
    price_id: "price_1SLk70Ajq2ZDgz7IsCwvvwhq",
    product_id: "prod_TIKmxYafsqTXwO",
    name: "Business Starter Pack",
  },
  enterprise: {
    price_id: "price_1SLk7PAjq2ZDgz7IgoiA3E6W",
    product_id: "prod_TIKmurHwJ5bDWJ",
    name: "Business Velocity Pack",
  },
} as const;

export const PRODUCT_NAMES: Record<string, string> = {
  [MEMBERSHIP_TIERS.single.product_id]: MEMBERSHIP_TIERS.single.name,
  [MEMBERSHIP_TIERS.family.product_id]: MEMBERSHIP_TIERS.family.name,
  [MEMBERSHIP_TIERS.business.product_id]: MEMBERSHIP_TIERS.business.name,
  [MEMBERSHIP_TIERS.enterprise.product_id]: MEMBERSHIP_TIERS.enterprise.name,
};
