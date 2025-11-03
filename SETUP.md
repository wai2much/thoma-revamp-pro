# TyrePlus Membership Platform - Developer Setup Guide

Welcome to the TyrePlus Membership Platform! This guide will help you set up the project locally for development.

**Tech Stack:**
- Frontend: React 18 + TypeScript + Vite + Tailwind CSS
- Backend: Lovable Cloud (Supabase-powered)
- Payment: Stripe Checkout & Customer Portal
- Wallet: PassEntry API (Apple Wallet + Google Pay)
- Mobile: Capacitor 7 (iOS/Android)
- AI: Lovable AI (GPT-5, Gemini 2.5), ElevenLabs voice

**Project Type:** Full-stack membership management system with subscription payments, digital wallet passes, loyalty program, QR scanning, and AI chatbot.

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** or **Bun runtime** ([Download Node.js](https://nodejs.org/))
- **Git** for version control
- **Code Editor** (VS Code recommended with ESLint + Prettier extensions)
- **(Optional) Mobile Development Tools:**
  - Xcode 15+ (for iOS builds, macOS only)
  - Android Studio (for Android builds)

---

## Quick Start

### 1. Clone the Repository
```bash
git clone [your-repo-url]
cd tyreplus-platform
```

### 2. Install Dependencies
```bash
npm install
# OR if using Bun:
bun install
```

### 3. Start Development Server
```bash
npm run dev
# OR:
bun run dev
```

The app will open at **http://localhost:8080** with hot reload enabled.

✅ **You're done!** The frontend is now running. Backend (Lovable Cloud) is auto-configured.

---

## Environment Configuration

### Auto-Generated Variables

The `.env` file is **automatically generated** by Lovable Cloud and should **NEVER be manually edited**. It contains:

```env
VITE_SUPABASE_URL=https://lnfmxpcpudugultrpwwa.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=[auto-generated-key]
VITE_SUPABASE_PROJECT_ID=lnfmxpcpudugultrpwwa
```

**Important:**
- ❌ Do NOT commit `.env` to Git (already in `.gitignore`)
- ❌ Do NOT manually edit `.env` - it syncs automatically
- ✅ These variables are safe for frontend use (publishable keys only)

### Backend Secrets (Managed via Lovable Cloud)

The following secrets are required for full functionality but are **NOT in `.env`**. They are stored securely in Lovable Cloud and accessible only to edge functions:

**Required for Core Features:**
- `STRIPE_SECRET_KEY` - Stripe payment processing
- `PASSENTRY_API_KEY` - Apple/Google Wallet pass generation
- `PASSENTRY_WEBHOOK_SECRET` - Wallet pass update webhooks

**Optional (for notifications):**
- `RESEND_API_KEY` - Email notifications via Resend
- `TWILIO_ACCOUNT_SID` - SMS notifications
- `TWILIO_AUTH_TOKEN` - SMS authentication
- `TWILIO_PHONE_NUMBER` - SMS sender number
- `ELEVENLABS_API_KEY` - Voice AI conversations

**System Secrets (Auto-configured):**
- `SUPABASE_URL` - Backend URL
- `SUPABASE_ANON_KEY` - Public Supabase key
- `SUPABASE_SERVICE_ROLE_KEY` - Admin Supabase key (NEVER expose to frontend)
- `SUPABASE_PUBLISHABLE_KEY` - Public key for client
- `SUPABASE_DB_URL` - Database connection string

> **Note:** If edge functions fail with "Missing API key" errors, check that secrets are configured in Lovable Cloud UI.

---

## Database Setup

**Good news:** No manual database setup required! 🎉

Lovable Cloud automatically provisions a Supabase PostgreSQL database with:
- ✅ Auto-applied schema migrations from `supabase/migrations/`
- ✅ Row-Level Security (RLS) policies enabled
- ✅ Real-time subscriptions enabled
- ✅ User authentication configured

**Key Tables:**
- `user_roles` - Staff role assignments (operator, narrator, responder, admin)
- `loyalty_points` - Member points transactions
- `loyalty_rewards` - Available rewards catalog
- `membership_passes` - Digital wallet pass records
- `passentry_config` - PassEntry template configuration
- `slack_events` - Slack workspace event logs

**Key Views:**
- `user_loyalty_summary` - Aggregated points balance per user

**Database Functions:**
- `get_user_points_balance(user_id)` - Calculate user's current points
- `has_role(user_id, role)` - Check if user has specific role

**Access Database:**
- View data via Lovable Cloud UI (ask project owner for access)
- Query using Supabase client: `import { supabase } from "@/integrations/supabase/client"`

---

## Edge Functions (Backend Logic)

The project includes **16 serverless edge functions** (Deno runtime) that auto-deploy on save:

### Payment & Subscription
- `create-checkout` - Initiate Stripe subscription checkout
- `check-subscription` - Verify active subscription status
- `customer-portal` - Generate Stripe billing portal link

### Wallet Passes
- `generate-wallet-pass` - Create Apple Wallet / Google Pay passes
- `list-pass-templates` - Fetch available pass templates
- `setup-pass-templates` - Initialize PassEntry templates
- `update-passentry-config` - Update pass template configuration
- `passentry-webhook` - Handle pass update webhooks

### Loyalty Program
- `generate-loyalty-card` - Generate QR loyalty cards
- `create-loyalty-template` - Create loyalty card template
- `grant-signup-bonus` - Award points on user signup
- `redeem-reward` - Process loyalty reward redemption

### Notifications & AI
- `send-membership-welcome` - Send welcome email/SMS on subscription
- `twilio-webhook` - Handle incoming SMS messages
- `tyre-assistant` - AI chatbot powered by Lovable AI (GPT-5)
- `elevenlabs-conversation` - Voice conversation AI via Twilio

**How They Work:**
- Functions are in `supabase/functions/[function-name]/index.ts`
- Auto-deploy when you save changes (no manual deployment)
- Access secrets via `Deno.env.get('SECRET_NAME')`
- Logs viewable in Lovable Cloud UI

**Authentication:**
- Functions with `verify_jwt = true` require user auth token
- Public functions (webhooks) have `verify_jwt = false`

---

## Development Workflow

### Running the App
```bash
npm run dev       # Start dev server at localhost:8080
npm run build     # Production build
npm run preview   # Preview production build locally
npm run lint      # Run ESLint code checks
```

### Hot Reload
- **Frontend changes**: Instant reload in browser
- **Edge functions**: Auto-deploy on save (no restart needed)
- **Database schema**: Requires migration file + redeploy

### File Structure
```
tyreplus-platform/
├── src/
│   ├── pages/              # Route components (Index, Auth, Dashboard, etc.)
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # shadcn/ui primitives (45+ components)
│   │   ├── AIAssistant.tsx
│   │   ├── WalletPassButton.tsx
│   │   ├── LoyaltyCardCapture.tsx
│   │   └── ...
│   ├── contexts/           # AuthContext (user session management)
│   ├── stores/             # Zustand stores (cartStore)
│   ├── integrations/       # Supabase client (AUTO-GENERATED, DO NOT EDIT)
│   ├── lib/                # Utilities (membershipTiers, shopify)
│   └── hooks/              # Custom React hooks
├── supabase/
│   ├── functions/          # Edge functions (backend)
│   ├── migrations/         # Database schema versions
│   └── config.toml         # Edge function config
├── public/                 # Static assets (images, favicons, banners)
├── capacitor.config.ts     # Mobile app config
├── vite.config.ts          # Vite bundler config
└── package.json            # Dependencies
```

### Key Files (DO NOT EDIT)
- `.env` - Auto-generated by Lovable Cloud
- `src/integrations/supabase/client.ts` - Auto-generated Supabase client
- `src/integrations/supabase/types.ts` - Auto-generated DB types
- `supabase/config.toml` - Auto-managed function config (except project_id)

---

## Testing Features Locally

### 1. Authentication
```
1. Go to /auth
2. Sign up with email + password
3. Auto-confirmed (no email verification needed)
4. Redirects to homepage with user session
```

### 2. Membership Subscription
```
1. Click "View Plans" on homepage
2. Select a plan (Single/Family/Business/Enterprise)
3. Click "Subscribe Now"
4. Redirected to Stripe Checkout (test mode)
5. Use test card: 4242 4242 4242 4242
6. Complete checkout → redirects to /membership-success
7. Wallet pass generated automatically
```

**Membership Tiers:**
| Tier | Price | Product ID |
|------|-------|------------|
| Single Pack | $99/month | `prod_TIKlo107LUfRkP` |
| Family Pack | $149/month | `prod_TIKmAWTileFjnm` |
| Business Starter | $299/month | `prod_TIKmxYafsqTXwO` |
| Business Velocity | $499/month | `prod_TIKmurHwJ5bDWJ` |

### 3. Digital Wallet Pass
```
1. After subscribing, go to /membership
2. Click "Add to Apple Wallet" or "Add to Google Pay"
3. Opens .pkpass file (iPhone) or pass link (Android)
4. Pass displays member ID, tier, expiry date
```

### 4. Loyalty System
```
1. Go to /loyalty (must be logged in)
2. View your loyalty points balance
3. Browse available rewards
4. Redeem a reward (deducts points)
5. Click "Show My Card" to view QR loyalty card
```

### 5. AI Tyre Assistant
```
1. Click the chat bubble icon (bottom-right)
2. Ask questions like "What tyres fit a Toyota Camry?"
3. AI streams responses in real-time
4. Powered by Lovable AI (no API key needed)
```

### 6. Staff Scanner (QR/Barcode)
```
1. Go to /scanner (requires authentication)
2. Click "Scan QR Code" to activate camera
3. Scan a loyalty card QR code or membership pass barcode
4. Member details appear with check-in option
5. Award loyalty points on check-in
```

### Test Data
- **Stripe Test Cards**: [https://stripe.com/docs/testing](https://stripe.com/docs/testing)
  - Success: `4242 4242 4242 4242`
  - Decline: `4000 0000 0000 0002`
- **Test Member ID Format**: `10B98-A7F3K2D` (membership passes)
- **Test Customer ID Format**: `TYREPLUS-cus_abc123` (loyalty cards)

---

## Mobile Development (Optional)

### Setup (One-Time)
```bash
# 1. Build web app
npm run build

# 2. Add platforms (only needed once)
npx cap add ios
npx cap add android

# 3. Sync web build to native projects
npx cap sync
```

### Running on Devices

**iOS (Requires macOS + Xcode 15+):**
```bash
npx cap open ios
# Xcode opens → Select device/simulator → Press ▶️ Run
```

**Android (Requires Android Studio):**
```bash
npx cap open android
# Android Studio opens → Select device/emulator → Press ▶️ Run
```

### Mobile-Specific Features
- QR code scanning (via `@capacitor-mlkit/barcode-scanning`)
- Barcode scanning (UPC, EAN, Code128, etc.)
- Device camera access
- Platform detection (iOS vs Android)

### Hot Reload for Mobile
The app is configured to load from:
```
https://64a7bebe-dd72-4b4c-ba13-a98f02a39d2a.lovableproject.com?forceHideBadge=true
```
This enables live updates without rebuilding the native app.

**To disable hot reload** (for production):
1. Edit `capacitor.config.ts`
2. Remove the `server.url` field
3. Rebuild: `npm run build && npx cap sync`

---

## Troubleshooting

### Port 8080 Already in Use
```typescript
// Edit vite.config.ts
server: {
  host: "::",
  port: 3000,  // Change to any available port
}
```

### Edge Function Errors
**Symptom:** Function fails with "Missing API key" or "Unauthorized"
```bash
1. Check secrets are configured in Lovable Cloud UI
2. Verify function name matches supabase/config.toml
3. Check edge function logs in Lovable Cloud
4. Ensure verify_jwt = true for authenticated functions
```

### Stripe Checkout Not Working
```bash
1. Verify STRIPE_SECRET_KEY is set in Lovable Cloud
2. Use test mode key (starts with sk_test_...)
3. Test with card: 4242 4242 4242 4242
4. Check browser console for errors
5. Verify check-subscription edge function logs
```

### Wallet Pass Generation Fails
```bash
1. Verify PASSENTRY_API_KEY is set
2. Check passentry_config table has template IDs
3. Run /passentry-setup to initialize templates
4. Check generate-wallet-pass function logs
```

### Authentication Loop / Session Issues
```bash
1. Clear browser localStorage
2. Open in incognito/private mode
3. Check browser console for auth errors
4. Verify user exists in auth.users (via Lovable Cloud UI)
```

### Mobile App Won't Build
```bash
# iOS:
- Update Xcode to 15+
- Run: xcode-select --install
- Delete ios/App/Pods, then: cd ios/App && pod install

# Android:
- Update Android Studio to latest
- File → Invalidate Caches → Restart
- Sync Gradle files
```

### Database Query Errors
```bash
1. Check RLS policies are configured correctly
2. Verify user is authenticated (check AuthContext)
3. Use Supabase client methods (never raw SQL in edge functions)
4. Check database logs in Lovable Cloud UI
```

### AI Chatbot Not Responding
```bash
1. Check browser console for fetch errors
2. Verify tyre-assistant function is deployed
3. Check function logs for model errors
4. Ensure VITE_SUPABASE_URL is correct in .env
5. Try in incognito mode to rule out cache issues
```

### QR Scanner Not Working
```bash
# Web:
1. Ensure HTTPS or localhost (camera requires secure context)
2. Grant camera permissions in browser
3. Check browser console for errors

# Mobile:
1. Add camera permissions to AndroidManifest.xml / Info.plist
2. Rebuild with: npm run build && npx cap sync
3. Check device has camera permissions enabled
```

### Still Stuck?
1. Check `PROJECT_DOCUMENTATION.md` for detailed technical info
2. Review `DEPLOYMENT_LOG.md` for deployment history
3. Enable browser DevTools → Network tab to inspect API calls
4. Test in incognito mode to rule out cache/cookie issues
5. Check edge function logs in Lovable Cloud for backend errors

---

## Key Technologies

### Frontend Stack
- **React 18** - UI library with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool & dev server
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - Pre-styled components (45+ included)
- **React Router** - Client-side routing
- **React Query** - Server state management
- **Zustand** - Client state management (cart)
- **React Hook Form** - Form handling & validation
- **Zod** - Schema validation

### Backend Stack
- **Lovable Cloud** - Managed Supabase backend
- **PostgreSQL** - Relational database
- **Edge Functions** - Serverless Deno runtime
- **Row-Level Security** - Database-level auth
- **Real-time subscriptions** - Live data updates

### Payment & Wallet
- **Stripe API** - Subscription billing
- **Stripe Checkout** - Hosted payment pages
- **Stripe Customer Portal** - Self-service billing
- **PassEntry API** - Wallet pass generation
- **Apple Wallet** - iOS digital passes
- **Google Pay** - Android digital passes

### Mobile Stack
- **Capacitor 7** - Native app bridge
- **ML Kit Barcode Scanner** - QR/barcode scanning
- **iOS / Android** - Native platform support

### AI Stack
- **Lovable AI** - Multi-model router (GPT-5, Gemini 2.5)
- **ElevenLabs** - Voice conversation AI
- **Streaming responses** - Real-time chat UX

### Developer Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TS-specific linting
- **Git** - Version control

---

## NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 8080) |
| `npm run build` | Production build (optimized) |
| `npm run build:dev` | Development build (with source maps) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint checks |

**Mobile Commands:**
```bash
npx cap add ios              # Add iOS platform (once)
npx cap add android          # Add Android platform (once)
npx cap sync                 # Sync web build to native
npx cap open ios             # Open Xcode
npx cap open android         # Open Android Studio
npx cap run ios              # Build & run on iOS device
npx cap run android          # Build & run on Android device
```

---

## Further Documentation

- **[PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)** - Full technical reference (1,116 lines)
- **[DEPLOYMENT_LOG.md](./DEPLOYMENT_LOG.md)** - Production deployment history
- **[MEMBERSHIP_CHECKLIST.md](./MEMBERSHIP_CHECKLIST.md)** - Feature verification checklist
- **[PRE_LAUNCH_CHECKLIST.md](./PRE_LAUNCH_CHECKLIST.md)** - Launch readiness checklist
- **[PASSENTRY_TEMPLATE_SETUP.md](./PASSENTRY_TEMPLATE_SETUP.md)** - Wallet pass configuration guide
- **[SCANNER_SETUP.md](./SCANNER_SETUP.md)** - QR scanner implementation details

**External Resources:**
- [Stripe Testing Docs](https://stripe.com/docs/testing)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Lovable Cloud Guide](https://docs.lovable.dev/features/cloud)
- [PassEntry API Docs](https://passentry.com/docs)

---

## Code Conventions

### Component Structure
```typescript
// Use named exports for components
export const MyComponent = () => {
  // Hooks at top
  const [state, setState] = useState();
  const { data } = useQuery();
  
  // Event handlers
  const handleClick = () => { };
  
  // Render
  return <div>...</div>;
};
```

### Imports
```typescript
// Use @ alias for src imports
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
```

### Styling
- Use Tailwind utility classes (preferred)
- Use `cn()` helper for conditional classes
- Extract reusable styles to components
- Use semantic tokens from index.css (e.g., `bg-primary`, `text-foreground`)

### TypeScript
- Enable strict mode (already configured)
- Define interfaces for all data structures
- Avoid `any` type (use `unknown` if needed)
- Use Supabase-generated types from `@/integrations/supabase/types`

### Edge Functions
- Always include CORS headers for web-facing functions
- Log errors with context for debugging
- Use Supabase client methods (never raw SQL)
- Handle authentication properly (check `verify_jwt` config)
- Access secrets via `Deno.env.get('SECRET_NAME')`

### Database
- **NEVER** edit `src/integrations/supabase/types.ts` (auto-generated)
- Use migrations for all schema changes
- Always enable RLS on new tables
- Use `SECURITY DEFINER` functions for role checks
- Test RLS policies thoroughly before deploying

### Security
- **NEVER** store sensitive data in localStorage
- **NEVER** check roles client-side (use `has_role()` function)
- **ALWAYS** validate user input in edge functions
- **ALWAYS** use RLS policies on tables with user data
- **NEVER** expose service role key to frontend

---

## Getting Started Checklist

- [ ] Clone repository and install dependencies
- [ ] Start dev server (`npm run dev`)
- [ ] Create test account at `/auth`
- [ ] Test Stripe checkout with test card
- [ ] Generate wallet pass (if PASSENTRY_API_KEY configured)
- [ ] Test loyalty card generation
- [ ] Try AI chatbot
- [ ] Test QR scanner functionality
- [ ] Review existing documentation files
- [ ] Join team communication channels

---

## Need Help?

1. **Check Documentation:** Start with `PROJECT_DOCUMENTATION.md`
2. **Console Logs:** Open browser DevTools for error details
3. **Edge Function Logs:** Check Lovable Cloud UI for backend errors
4. **Test in Incognito:** Rule out cache/cookie issues
5. **Verify Secrets:** Ensure all required API keys are configured
6. **Ask the Team:** Reach out to project maintainers

---

**Happy coding! 🚗💨**
