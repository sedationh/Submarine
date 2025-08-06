import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Submarine - YouTube Subtitle Position Controller',
    description: 'A browser extension that allows users to adjust YouTube video subtitle positions. Supports YouTube native subtitles.',
    version: '1.0.0',
    permissions: [
      'activeTab',
      'storage'
    ],
    host_permissions: [
      '*://*.youtube.com/*'
    ],
    icons: {
      16: 'icon/16.png',
      32: 'icon/32.png',
      48: 'icon/48.png',
      96: 'icon/96.png',
      128: 'icon/128.png'
    }
  }
});
