# PassEntry Template Setup Guide

## Template Configuration for TyrePlus Membership Tiers

Create 4 separate templates at [https://app.passentry.com/pass-templates](https://app.passentry.com/pass-templates)

---

## Template 1: Single Pack
**Background Color:** `#3B82F6` (Blue)  
**Member ID Prefix:** TP

### Fields to Add:
1. **Member Name** (Text Field)
   - Label: "Member Name"
   - Key: `member_name`

2. **Member ID** (Text Field)
   - Label: "Member ID"
   - Key: `member_id`

3. **Member Since** (Text Field)
   - Label: "Member Since"
   - Key: `member_since`

4. **Tier Name** (Text Field)
   - Label: "Plan"
   - Key: `tier_name`
   - Default Value: "Single Pack"

### Banner Image:
Upload a banner image (1500x600px recommended) or use dynamic banner via API

**After saving, copy the Template UUID**

---

## Template 2: Family Pack
**Background Color:** `#10B981` (Green)  
**Member ID Prefix:** FP

### Fields to Add:
1. **Member Name** (Text Field)
   - Label: "Member Name"
   - Key: `member_name`

2. **Member ID** (Text Field)
   - Label: "Member ID"
   - Key: `member_id`

3. **Member Since** (Text Field)
   - Label: "Member Since"
   - Key: `member_since`

4. **Tier Name** (Text Field)
   - Label: "Plan"
   - Key: `tier_name`
   - Default Value: "Family Pack"

### Banner Image:
Upload a banner image (1500x600px recommended) or use dynamic banner via API

**After saving, copy the Template UUID**

---

## Template 3: Business Starter Pack
**Background Color:** `#F59E0B` (Amber)  
**Member ID Prefix:** BS

### Fields to Add:
1. **Member Name** (Text Field)
   - Label: "Member Name"
   - Key: `member_name`

2. **Member ID** (Text Field)
   - Label: "Member ID"
   - Key: `member_id`

3. **Member Since** (Text Field)
   - Label: "Member Since"
   - Key: `member_since`

4. **Tier Name** (Text Field)
   - Label: "Plan"
   - Key: `tier_name`
   - Default Value: "Business Starter Pack"

### Banner Image:
Upload a banner image (1500x600px recommended) or use dynamic banner via API

**After saving, copy the Template UUID**

---

## Template 4: Business Velocity Pack
**Background Color:** `#EF4444` (Red)  
**Member ID Prefix:** BV

### Fields to Add:
1. **Member Name** (Text Field)
   - Label: "Member Name"
   - Key: `member_name`

2. **Member ID** (Text Field)
   - Label: "Member ID"
   - Key: `member_id`

3. **Member Since** (Text Field)
   - Label: "Member Since"
   - Key: `member_since`

4. **Tier Name** (Text Field)
   - Label: "Plan"
   - Key: `tier_name`
   - Default Value: "Business Velocity Pack"

### Banner Image:
Upload a banner image (1500x600px recommended) or use dynamic banner via API

**After saving, copy the Template UUID**

---

## Next Steps

Once you've created all 4 templates:

1. **Copy each Template UUID** from PassEntry
2. **Update the edge function** to use tier-specific templates instead of a single template
3. **Test pass generation** for each tier

### Current System:
The `generate-wallet-pass` edge function currently uses:
- Single template ID: `PASSENTRY_TEMPLATE`
- Dynamic colors via `PRODUCT_COLORS` mapping
- Random car banners from `CAR_BANNERS` array

### Recommended Update:
Map each product ID to its specific template UUID:

```typescript
const TEMPLATE_IDS = {
  "prod_TIKlo107LUfRkP": "template_uuid_single",      // Single Pack
  "prod_TIKmAWTileFjnm": "template_uuid_family",      // Family Pack
  "prod_TIKmxYafsqTXwO": "template_uuid_business",    // Business Starter
  "prod_TIKmurHwJ5bDWJ": "template_uuid_enterprise",  // Business Velocity
};
```

---

## Design Guidelines

- **Typography:** Use clean, modern sans-serif fonts
- **Layout:** Keep member information clearly visible
- **Contrast:** Ensure text is readable on colored backgrounds
- **Branding:** Include TyrePlus logo if available
- **QR Code:** PassEntry will auto-generate QR codes for scanning

---

## Testing Checklist

After setup, test each tier:
- [ ] Single Pack pass generates correctly
- [ ] Family Pack pass generates correctly  
- [ ] Business Starter Pack pass generates correctly
- [ ] Business Velocity Pack pass generates correctly
- [ ] All passes display correct colors
- [ ] All passes show correct member information
- [ ] Passes can be added to Apple Wallet
- [ ] Passes can be added to Google Wallet
