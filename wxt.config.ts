import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Submarine - YouTube 字幕位置控制器',
    description: '一个浏览器扩展，允许用户调整 YouTube 视频的字幕位置。支持 YouTube 原生字幕。',
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
