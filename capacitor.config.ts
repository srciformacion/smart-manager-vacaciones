
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.598b4b6779b64e8a88d3f670afcb5781',
  appName: 'smart-manager-vacaciones',
  webDir: 'dist',
  server: {
    url: 'https://598b4b67-79b6-4e8a-88d3-f670afcb5781.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    contentInset: 'always'
  },
  android: {
    contentInset: 'always'
  }
};

export default config;
