/**
 * @ Author: Hikaru
 * @ Create Time: 2023-02-08 01:35:14
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-12 02:33:51
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
          title: 'Collection Create',
          path: '/collection/create',
          component: 'Collection/Create',
        },
        {
          title: 'Collection Detail',
          path: '/collection/:id',
          routes: [
            {
              title: 'Collection Detail',
              path: '/collection/:id',
              component: 'Collection/Detail',
            },
            {
              title: 'Add Item',
              path: '/collection/:id/add',
              component: 'Collection/Detail/Add',
            },
          ],
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
  proxy: {
    '/api': {
      target: 'http://13.214.203.20:6000',
      changeOrigin: true,
    },
  },
});
