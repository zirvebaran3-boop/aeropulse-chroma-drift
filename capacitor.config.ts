import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hredgamesstudio.aeropulse',
  appName: 'AeroPulse: Chroma Drift',
  webDir: 'dist',
  backgroundColor: '#1d1833',
  ios: {
    // oyun tam ekran: WebView centik/ev cubugu altina uzanir, sayfa esneyip kaymaz
    contentInset: 'never',
    scrollEnabled: false,
  },
};

export default config;
