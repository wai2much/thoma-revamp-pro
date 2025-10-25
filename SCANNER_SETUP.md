# Scanner Setup Instructions

## Mobile App Setup (Both iPhone & Android)

### 1. Export & Pull Project
```bash
# In Lovable: Click "Export to Github"
# Then locally:
git clone your-repo-url
cd your-project
npm install
```

### 2. Add Capacitor Platforms
```bash
# For iPhone (requires Mac + Xcode)
npx cap add ios
npx cap update ios

# For Android (requires Android Studio)
npx cap add android
npx cap update android
```

### 3. Install NFC Plugin
The NFC plugin needs to be installed manually:
```bash
npm install @capacitor-community/nfc
```

### 4. Configure Permissions

#### iOS (Info.plist)
Add to `ios/App/App/Info.plist`:
```xml
<key>NFCReaderUsageDescription</key>
<string>This app uses NFC to read membership cards</string>
<key>NSCameraUsageDescription</key>
<string>This app uses the camera to scan QR codes</string>
```

#### Android (AndroidManifest.xml)
Add to `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.NFC" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-feature android:name="android.hardware.nfc" android:required="false" />
<uses-feature android:name="android.hardware.camera" android:required="false" />
```

### 5. Build & Sync
```bash
npm run build
npx cap sync
```

### 6. Run on Device
```bash
# For iPhone
npx cap run ios

# For Android
npx cap run android
```

## Using the Scanner

1. **Navigate to Scanner**: Sign in, then click "Scanner" in the navigation
2. **Scan QR Code**: Tap "Scan QR Code" button to use camera
3. **Tap NFC**: Tap "Tap NFC" button and hold phone near membership card
4. **Manual Search**: Enter Member ID manually as backup

## Testing

### QR Code Format
The app expects QR codes in format: `TYREPLUS-{CUSTOMER_ID}`
Example: `TYREPLUS-CUS_TIT5MDVY`

### NFC Testing
- Test with Apple Wallet or Google Pay passes
- NFC must be enabled in phone settings
- iPhone: NFC works automatically
- Android: May need to enable NFC in Settings

## Troubleshooting

### Camera Not Working
- Check permissions in phone settings
- For iOS: Settings > Your App > Camera
- For Android: Settings > Apps > Your App > Permissions

### NFC Not Scanning
- Ensure NFC is enabled in phone settings
- iPhone: NFC is always on (iPhone 7+)
- Android: Settings > Connected devices > Connection preferences > NFC

### Build Errors
If you get Capacitor sync errors:
```bash
npx cap sync --force
```

## Next Steps

The scanner currently validates members using the existing Stripe customer data. You can enhance it with:
- Store check-in records in database
- Add transaction tracking
- Implement loyalty points system
- Create staff analytics dashboard
