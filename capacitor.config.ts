import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tyreplus.membership',
  appName: 'TyrePlus Membership',
  webDir: 'dist',
  server: {
    url: 'https://64a7bebe-dd72-4b4c-ba13-a98f02a39d2a.lovableproject.com?forceHideBadge=true',
    cleartext: true
  }
};

export default config;
