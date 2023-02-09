/**
 * @ Author: Hikaru
 * @ Create Time: 2023-02-08 01:35:14
 * @ Modified by: Hikaru
 * @ Modified time: 2023-02-08 23:27:40
 * @ Description: i@rua.moe
 */

import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  locale: {
    default: 'en-US',
    antd: true,
    baseNavigator: true,
  },
  routes: [
    {
      path: "/",
      component: "Home",
    },
  ],
  ignoreMomentLocale: true,
  manifest: {
    basePath: '/',
  },
  fastRefresh: true,
  presets: ['umi-presets-pro'],
  npmClient: 'yarn',
});
