# TyrePlus Pre-Launch Checklist

## ✅ PassEntry Integration
- [x] **Loyalty Program Template**: `d83788a55d1c58` configured
- [x] **Single Pack Template**: `90e4ef389c8cf3c6d6138693` configured
- [x] **Family Safety Pack Template**: `f45e2724e53d75f970` configured
- [x] **Business Starter Pack Template**: `57502c036b313153824c570a` configured
- [x] **Business Velocity Pack Template**: `3e7ca1f45cff9959065e988d` configured
- [ ] Test loyalty card generation (homepage form)
- [ ] Test membership pass generation (after subscription purchase)
- [ ] Verify passes can be added to Apple Wallet
- [ ] Verify passes can be added to Google Wallet

---

## ✅ Stripe Integration
- [ ] Verify Stripe secret key is configured
- [ ] Test Single Pack subscription ($99/month)
- [ ] Test Family Safety Pack subscription ($149/month)
- [ ] Test Business Starter Pack subscription ($249/month)
- [ ] Test Business Velocity Pack subscription ($499/month)
- [ ] Test checkout flow end-to-end
- [ ] Test subscription status updates
- [ ] Test customer portal access
- [ ] Verify successful payment redirects to success page

---

## ✅ Authentication System
- [ ] Test email signup with auto-confirm
- [ ] Test email login
- [ ] Test logout functionality
- [ ] Test protected routes (redirect to /auth when not logged in)
- [ ] Test session persistence across page refreshes
- [ ] Verify auth state syncs with subscription status

---

## ✅ Database & Backend
- [ ] Verify all RLS policies are active
- [ ] Test `loyalty_points` table (earn/redeem)
- [ ] Test `loyalty_rewards` table (view active rewards)
- [ ] Test `membership_passes` table (pass storage)
- [ ] Test `passentry_config` table (template mapping)
- [ ] Verify `get_user_points_balance` function works
- [ ] Check all edge functions are deployed

---

## ✅ Edge Functions
- [ ] `generate-loyalty-card` - Test loyalty card generation
- [ ] `generate-wallet-pass` - Test membership pass generation
- [ ] `check-subscription` - Test subscription verification
- [ ] `create-checkout` - Test Stripe checkout creation
- [ ] `customer-portal` - Test customer portal access
- [ ] `grant-signup-bonus` - Test signup bonus points
- [ ] `redeem-reward` - Test reward redemption
- [ ] `passentry-webhook` - Verify webhook receives PassEntry events
- [ ] Check all edge function logs for errors

---

## ✅ Frontend Pages
### Homepage (/)
- [ ] Hero section displays correctly
- [ ] Loyalty card capture form works
- [ ] "Get Your $20 Card" generates loyalty card
- [ ] Pass downloads and opens in wallet
- [ ] Benefits section displays
- [ ] Service capabilities section displays
- [ ] CTA sections work
- [ ] Mobile responsive

### Membership (/membership)
- [ ] All 4 membership tiers display correctly
- [ ] Pricing shows correctly
- [ ] "Get Started" buttons work
- [ ] Checkout redirects properly
- [ ] Current plan highlighted if subscribed
- [ ] Mobile responsive

### Loyalty (/loyalty)
- [ ] Points balance displays correctly
- [ ] Transaction history shows
- [ ] Available rewards display
- [ ] Redeem buttons work
- [ ] Success/error toasts appear
- [ ] Points update in real-time
- [ ] Mobile responsive

### Shop (/shop)
- [ ] Products load from Shopify
- [ ] Product images display
- [ ] Add to cart works
- [ ] Cart icon updates with item count
- [ ] Product details show correctly
- [ ] Mobile responsive

### Cart (/cart)
- [ ] Cart items display
- [ ] Quantity adjustment works
- [ ] Remove item works
- [ ] Total calculates correctly
- [ ] Checkout button works
- [ ] Empty cart state displays
- [ ] Mobile responsive

### Scanner (/scanner)
- [ ] Camera permission requests
- [ ] QR code scanning works
- [ ] Barcode scanning works
- [ ] Scanned data displays
- [ ] Works on mobile devices

### Auth (/auth)
- [ ] Signup form works
- [ ] Login form works
- [ ] Email validation works
- [ ] Error messages display
- [ ] Success redirects to homepage
- [ ] Mobile responsive

### Success (/membership-success)
- [ ] Displays after successful subscription
- [ ] Shows correct membership tier
- [ ] "Download Your Pass" button works
- [ ] Pass generates with correct template
- [ ] Redirects work properly

---

## ✅ Mobile Wallet Integration
- [ ] Test on iOS device - Add to Apple Wallet
- [ ] Test on Android device - Add to Google Wallet
- [ ] Verify QR codes scan correctly
- [ ] Verify pass updates reflect in wallet
- [ ] Test pass removal and re-download

---

## ✅ Loyalty Program Features
- [ ] Signup bonus (99 points) granted automatically
- [ ] Points earned on purchases
- [ ] Points balance calculates correctly
- [ ] Rewards can be redeemed
- [ ] Transaction history accurate
- [ ] Points deducted after redemption

---

## ✅ AI Features
- [ ] AI Assistant button appears
- [ ] Conversation starts properly
- [ ] Voice interaction works (if enabled)
- [ ] Tyre recommendations work
- [ ] Responses are accurate

---

## ✅ UI/UX
- [ ] All buttons have hover states
- [ ] Loading states show during async operations
- [ ] Toast notifications appear for user feedback
- [ ] Forms validate inputs
- [ ] Error messages are user-friendly
- [ ] Dark/light mode works (if implemented)
- [ ] Animations are smooth
- [ ] No console errors in browser

---

## ✅ Performance
- [ ] Page load times < 3 seconds
- [ ] Images are optimized
- [ ] No memory leaks
- [ ] Smooth scrolling
- [ ] Fast navigation between pages

---

## ✅ SEO & Meta
- [ ] Page titles set correctly
- [ ] Meta descriptions present
- [ ] OG image configured
- [ ] Robots.txt configured
- [ ] Sitemap.xml present
- [ ] Favicon loads

---

## ✅ Security
- [ ] All RLS policies tested
- [ ] API keys stored as secrets
- [ ] No sensitive data in console logs
- [ ] CORS configured correctly
- [ ] Auth tokens handled securely
- [ ] No XSS vulnerabilities

---

## ✅ Production Deployment
- [ ] Custom domain connected (if applicable)
- [ ] SSL certificate active
- [ ] DNS configured correctly
- [ ] Environment variables set
- [ ] Backup strategy in place
- [ ] Monitoring/logging configured

---

## 🚨 Critical Pre-Launch Tests
1. **Complete User Journey**:
   - [ ] Visit homepage → Sign up → Purchase membership → Download pass → Add to wallet
   - [ ] Sign in → View loyalty points → Redeem reward → Check transaction history
   - [ ] Browse shop → Add to cart → Checkout

2. **Payment Flow**:
   - [ ] Test with real Stripe test card (4242 4242 4242 4242)
   - [ ] Verify webhook receives payment confirmation
   - [ ] Check subscription activates immediately
   - [ ] Verify pass generates after payment

3. **Mobile Testing**:
   - [ ] Test on iPhone (Safari)
   - [ ] Test on Android (Chrome)
   - [ ] Verify wallet pass works on both platforms
   - [ ] Test responsive design on tablets

---

## 📋 Launch Day Tasks
- [ ] Enable Stripe live mode
- [ ] Update Stripe webhook to live endpoint
- [ ] Final database backup
- [ ] Monitor error logs
- [ ] Monitor Stripe dashboard
- [ ] Test live payment
- [ ] Announce launch

---

## 🔧 Post-Launch Monitoring
- [ ] Monitor edge function logs (first 24 hours)
- [ ] Check Stripe payment success rate
- [ ] Monitor PassEntry webhook events
- [ ] Track user signups
- [ ] Monitor subscription activations
- [ ] Check for any error spikes

---

## 📞 Support Contacts
- **Stripe Support**: https://support.stripe.com
- **PassEntry Support**: https://passentry.com/support
- **Supabase Support**: https://supabase.com/support
- **Lovable Support**: https://lovable.dev/support

---

**Last Updated**: ${new Date().toLocaleDateString()}
**Status**: Pre-Launch Review
