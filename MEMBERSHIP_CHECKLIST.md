# TYREPLUS Thomastown Membership System Checklist

## 🔐 Authentication & Backend (Supabase/Cloud)

### Auth Setup
- [ ] Email/password authentication enabled
- [ ] Auto-confirm email enabled in settings
- [ ] Sign up page working (`/auth`)
- [ ] Login page working (`/auth`)
- [ ] Logout functionality working
- [ ] Session persistence working (stays logged in on refresh)
- [ ] Protected routes redirect to login when not authenticated

### Database & Security
- [ ] User profiles table created (if needed)
- [ ] RLS policies configured on all tables
- [ ] Data is secure and only accessible by authorized users

### Edge Functions Deployed
- [ ] `create-checkout` - Creates Stripe checkout sessions
- [ ] `check-subscription` - Verifies active subscriptions
- [ ] `customer-portal` - Manages subscription changes
- [ ] `generate-wallet-pass` - Creates Apple Wallet passes
- [ ] `generate-loyalty-card` - Creates loyalty card images
- [ ] `tyre-assistant` - AI chatbot functionality

---

## 💳 Stripe Integration

### Configuration
- [ ] STRIPE_SECRET_KEY configured in secrets
- [ ] Stripe account connected
- [ ] Test mode vs Live mode clarified

### Products & Pricing
- [ ] Single Pack ($99/year) - Product & Price created
- [ ] Family Pack ($199/year) - Product & Price created
- [ ] Business Starter Pack ($499/year) - Product & Price created
- [ ] Business Velocity Pack ($999/year) - Product & Price created
- [ ] Price IDs stored in `src/lib/membershipTiers.ts`

### Payment Flow
- [ ] Checkout button on `/membership` page working
- [ ] Stripe checkout session opens successfully
- [ ] Success URL redirects correctly (`/membership-success`)
- [ ] Cancel URL redirects correctly (`/membership`)
- [ ] Payment confirmation working

### Subscription Management
- [ ] `check-subscription` function returns correct status
- [ ] Subscription status displays on user dashboard
- [ ] "Manage Subscription" button working
- [ ] Stripe Customer Portal opens correctly
- [ ] Users can cancel/upgrade/downgrade subscriptions
- [ ] Auto-refresh subscription status on login

### Customer Portal Setup
- [ ] Stripe Customer Portal activated at: https://dashboard.stripe.com/settings/billing/portal
- [ ] Portal configuration includes:
  - [ ] Cancel subscription option
  - [ ] Update payment method
  - [ ] View invoices
  - [ ] Upgrade/downgrade plans

---

## 📧 Resend (Email Service)

### Configuration
- [ ] RESEND_API_KEY configured in secrets
- [ ] Resend account created at: https://resend.com
- [ ] Domain verified at: https://resend.com/domains
  - [ ] Add DNS records for domain verification
  - [ ] Wait for domain verification (can take 24-48 hours)

### Email Templates
- [ ] Welcome email template created
- [ ] Payment confirmation email template
- [ ] Subscription activated email
- [ ] Subscription cancelled email (optional)
- [ ] Loyalty card delivery email

### Email Sending
- [ ] Test email sending from edge function
- [ ] Emails deliver successfully
- [ ] From address configured correctly
- [ ] Email styling looks good on mobile and desktop

### Edge Function
- [ ] Create `send-email` edge function (if not exists)
- [ ] Test email triggering after signup
- [ ] Test email triggering after payment
- [ ] Error handling for failed emails

---

## 🎫 PassEntry (Apple Wallet)

### Configuration
- [ ] PASSENTRY_API_KEY configured in secrets
- [ ] PassEntry account created
- [ ] Pass templates created in PassEntry dashboard

### Pass Templates
- [ ] Single Pack pass template
- [ ] Family Pack pass template
- [ ] Business Starter Pack pass template
- [ ] Business Velocity Pack pass template
- [ ] Templates include correct branding/logo
- [ ] Templates have QR code/barcode configured

### Wallet Pass Generation
- [ ] `generate-wallet-pass` function working
- [ ] Pass generates after successful payment
- [ ] "Add to Apple Wallet" button visible
- [ ] Pass downloads correctly on iOS devices
- [ ] Pass displays correctly in Apple Wallet
- [ ] Pass updates when subscription changes

### Testing
- [ ] Test pass generation on iPhone
- [ ] Test pass on different iOS versions
- [ ] Verify pass expiration dates are correct
- [ ] Test pass updates (if subscription changes)

---

## 🎨 Frontend Components

### Pages
- [ ] `/` - Homepage with hero and pricing preview
- [ ] `/auth` - Login/Signup page
- [ ] `/membership` - Full membership plans page
- [ ] `/membership-success` - Success page after payment
- [ ] `/scanner` - Loyalty card scanner (if needed)

### Components
- [ ] Navigation with auth status
- [ ] Hero section with CTA buttons
- [ ] Pricing plans cards
- [ ] Benefits section
- [ ] Service capabilities showcase
- [ ] Savings calculator
- [ ] Rewards program display
- [ ] AI Assistant chatbot
- [ ] Luxury membership card display
- [ ] Value breakdown component

### User Experience
- [ ] Responsive design on mobile
- [ ] Responsive design on tablet
- [ ] Responsive design on desktop
- [ ] Loading states for async operations
- [ ] Error messages display properly
- [ ] Success messages/toasts working
- [ ] Smooth scrolling to sections
- [ ] Forms validate input properly

---

## 🔄 Integration Testing

### End-to-End Flow
- [ ] User signs up successfully
- [ ] User receives welcome email
- [ ] User selects membership plan
- [ ] Stripe checkout opens correctly
- [ ] Payment processes successfully
- [ ] User redirected to success page
- [ ] Subscription status updates immediately
- [ ] Wallet pass generates automatically
- [ ] User receives confirmation email

### Error Scenarios
- [ ] Failed payment handled gracefully
- [ ] Invalid email format rejected
- [ ] Duplicate signup prevented
- [ ] Network errors show user-friendly messages
- [ ] Subscription check failures handled

---

## 🚀 Deployment

### Domain Setup
- [ ] Published to Lovable
- [ ] `tyreplusthomastown.com` connected
- [ ] `onlinetyreplusthomastown.com` connected
- [ ] DNS records configured (A record: 185.158.133.1)
- [ ] SSL certificates active (https working)
- [ ] DNS propagated (can take 24-48 hours)

### Production Readiness
- [ ] Switch Stripe to live mode (when ready)
- [ ] Update Stripe price IDs to live prices
- [ ] Verify Resend domain for production emails
- [ ] Test all edge functions in production
- [ ] Monitor error logs for issues
- [ ] Set up analytics/tracking (optional)

---

## 📋 Post-Launch

### Monitoring
- [ ] Monitor Stripe dashboard for payments
- [ ] Check Resend dashboard for email delivery
- [ ] Review edge function logs regularly
- [ ] Track subscription signups
- [ ] Monitor cancellations/churn

### Support
- [ ] Customer support process defined
- [ ] Refund policy documented
- [ ] FAQ section created (optional)
- [ ] Contact information visible

---

## ✅ Quick Test Checklist

**Before going live, test this flow:**

1. Create new account → ✅ Sign up works
2. Login with new account → ✅ Auth persists
3. View membership plans → ✅ Plans display
4. Click "Get Started" → ✅ Checkout opens
5. Complete payment (use Stripe test card: 4242 4242 4242 4242) → ✅ Payment succeeds
6. Redirected to success page → ✅ Redirect works
7. Check email → ✅ Confirmation received
8. Add to Apple Wallet → ✅ Pass generates
9. Check subscription status → ✅ Shows as active
10. Click "Manage Subscription" → ✅ Portal opens
11. Logout and login again → ✅ Subscription status persists

---

## 🔧 Troubleshooting Resources

- **Stripe Issues**: https://dashboard.stripe.com/logs
- **Resend Issues**: https://resend.com/emails
- **Edge Function Logs**: Use Lovable's backend viewer
- **DNS Issues**: https://dnschecker.org

---

**Last Updated**: ${new Date().toLocaleDateString()}
