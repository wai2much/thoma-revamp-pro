# PassEntry Template Updates - Nov 3, 2025

## Issues Identified by PassEntry Support (Lukas)

### 1. ✅ Template UUID Corrections
**Issue**: Loyalty Card template UUID was incomplete in database
- **Old**: `d83788a55d1c58`
- **New**: `d83788a55d1c58a224efa1c9`
- **Fix**: Updated `passentry_config` table with correct full UUID

### 2. ✅ Field ID Standardization
**Issue**: "Member Since" field had inconsistent IDs across templates
- Some templates used `custom`, others `Custom` or `CUSTOM`
- **Standardized to**: `Custom` (capital C to match PassEntry naming pattern)

**Issue**: Member Name field had typo
- **Old**: `First_Lastm`
- **New**: `First_Last` (removed trailing 'm')

### 3. ✅ Code Updates

#### Updated `generate-wallet-pass` Edge Function
Changed from generic label mapping to specific field IDs:

**Before:**
```typescript
pass: {
  stripImage: bannerUrl,
  backgroundColor: tierColor,
  label1: { value: memberName.toUpperCase() },
  label2: { value: memberId },
  label3: { value: memberSince },
  label4: { value: planName.toUpperCase() }
}
```

**After:**
```typescript
pass: {
  stripImage: bannerUrl,
  backgroundColor: tierColor,
  member_name: memberName.toUpperCase(),
  member_id: memberId,
  Custom: memberSince,
  tier_name: planName.toUpperCase()
}
```

## Current Template Configuration

All templates now use these standardized field IDs:

| Field Label | Field ID | Purpose |
|------------|----------|---------|
| Member Name | `member_name` | User's display name |
| Member ID | `member_id` | Unique member identifier |
| Member Since | `Custom` | Join date/year |
| Plan | `tier_name` | Membership tier name |

## Template UUIDs (Complete)

| Tier | Product ID | Template UUID |
|------|-----------|---------------|
| Loyalty Card | `loyalty_card` | `d83788a55d1c58a224efa1c9` |
| Single Pack | `prod_TIKlo107LUfRkP` | `90e4ef389c8cf3c6d6138693` |
| Family Pack | `prod_TIKmAWTileFjnm` | `f45e2724e53d75f970` |
| Business Starter | `prod_TIKmxYafsqTXwO` | `57502c036b313153824c570a` |
| Business Velocity | `prod_TIKmurHwJ5bDWJ` | `3e7ca1f45cff9959065e988d` |

## Files Updated

1. ✅ `supabase/functions/generate-wallet-pass/index.ts`
   - Updated field mapping to use correct PassEntry field IDs
   
2. ✅ `passentry_config` database table
   - Fixed Loyalty Card template UUID
   
3. ✅ `PASSENTRY_TEMPLATE_SETUP.md`
   - Updated all field ID references from `member_since` to `Custom`

## Testing Checklist

- [ ] Test Loyalty Card generation with new UUID
- [ ] Test Single Pack pass generation
- [ ] Test Family Pack pass generation
- [ ] Test Business Starter Pack pass generation
- [ ] Test Business Velocity Pack pass generation
- [ ] Verify all passes display correct field data
- [ ] Confirm passes successfully add to Apple Wallet
- [ ] Confirm passes successfully add to Google Wallet

## Notes

- PassEntry dashboard should now match exactly with code implementation
- All field IDs use consistent capitalization pattern
- Template UUIDs are now complete and correct
- 404 "template not found" errors should be resolved
