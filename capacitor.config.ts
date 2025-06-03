
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.598b4b6779b64e8a88d3f670afcb5781',
  appName: 'la-rioja-cuida',
  webDir: 'dist',
  server: {
    url: 'https://vacaciones.hhrrsrci.online',
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
