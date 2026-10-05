import type { CapacitorConfig } from '@capacitor/cli'

// appId — унікальний ідентифікатор у Play Market; після першої публікації його змінити не можна
const config: CapacitorConfig = {
  appId: 'com.gmaster.guessthemove',
  appName: 'Guess the Move',
  webDir: 'dist',
  android: {
    backgroundColor: '#0e0d0b',
  },
  plugins: {
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0e0d0b',
      overlaysWebView: false,
    },
  },
}

export default config
