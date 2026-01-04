import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.globalradio.app',
  appName: '全球电台',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 800,
      backgroundColor: "#1a365d",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      spinnerColor: "#00bcd4",
      androidSpinnerStyle: "small",
      iosSpinnerStyle: "small"
    },
    StatusBar: {
      style: "dark",
      backgroundColor: "#1a365d"
    },
    App: {
      disabledLaunchAnimation: false
    },
    Haptics: {
      enabled: true
    },
    Keyboard: {
      resize: "body"
    }
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    appendUserAgent: 'RadioApp/1.0'
  }
};

export default config;