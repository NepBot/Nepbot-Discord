/**
 * @ Author: Hikaru
 * @ Create Time: 2023-02-08 01:35:14
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-09 20:43:35
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
      path: '/',
      component: 'Home',
    },
    {
      title: 'Connect',
      path: '/connect',
      component: 'Connect',
      layout: false,
    },
    {
      title: 'Role',
      path: '/role',
      component: 'Role',
      layout: false,
    },
    {
      title: 'Mint',
      path: '/mint',
      component: 'Mint',
      layout: false,
    },
    {
      title: 'Select Platform',
      path: '/platform',
      component: 'Platform',
      layout: false,
    },
    {
      title: 'Collection',
      path: '/collection',
      layout: false,
      routes: [
        {
          title: 'Collection',
          path: '/collection',
          component: 'Collection',
        },
        {
          title: 'Collection Detail',
          path: '/collection/:id',
          component: 'Collection/Detail',
        },
      ],
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
