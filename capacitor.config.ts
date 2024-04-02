import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'ionic-pouchdb-sqlite',
  webDir: 'www',
  server: {
    androidScheme: 'https',
    allowNavigation: ['https://192.168.1.27:6984/employees']
  }
};

export default config;
