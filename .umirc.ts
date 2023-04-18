/**
 * @ Author: Hikaru
 * @ Create Time: 2023-02-08 01:35:14
 * @ Modified by: Hikaru
 * @ Modified time: 2023-04-13 04:04:54
 * @ Description: 
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
      title: 'Verify',
      path: '/verify',
      component: 'Verify',
      layout: false,
    },
    {
      title: 'Role',
      path: '/role',
      component: 'Role',
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
          title: 'Collection Console',
          path: '/collection/console',
          routes: [
            {
              title: 'Collection Console',
              path: '/collection/console',
              component: 'Collection/Console',
            },
            {
              title: 'Collection Console',
              path: '/collection/console/:contract_type',
              component: 'Collection/Console',
            },
          ],
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
          ],
        },
      ],
    },
    {
      title: 'FT',
      path: '/ft',
      layout: false,
      routes: [
        {
          title: 'FT AirDrop',
          path: '/ft/airdrop',
          component: 'FT/Airdrop',
        },
        {
          title: 'FT Claim',
          path: '/ft/claim',
          component: 'FT/Claim',
        },
        {
          title: 'FT Redeem',
          path: '/ft/redeem',
          component: 'FT/Redeem',
        },
      ],
    },
    {
      title: 'Vote',
      path: '/vote',
      layout: false,
      routes: [
        {
          title: 'Vote',
          path: '/vote',
          component: 'Vote',
        },
      ],
    },
    {
      title: 'Twitter',
      path: '/twitter',
      layout: false,
      routes: [
        {
          title: 'Twitter Verify',
          path: '/twitter/verify',
          component: 'Twitter/Verify',
        },
      ],
    },
    {
      title: 'Snapshot',
      path: '/snapshot',
      layout: false,
      routes: [
        {
          title: 'Create Snapshot',
          path: '/snapshot/create',
          component: 'Snapshot/Create',
        },
      ],
    },
  ],
  ignoreMomentLocale: false,
  manifest: {
    basePath: '/',
  },
  fastRefresh: true,
  presets: ['umi-presets-pro'],
  npmClient: 'yarn',
  proxy: {
    '/api': {
      target: 'http://13.214.203.20:8080',
      changeOrigin: true,
    },
    // '/arweave': {
    //   target: 'https://arweave.net',
    //   changeOrigin: true,
    //   pathRewrite: { '^/aeweave': '' },
    // },
  },
});
