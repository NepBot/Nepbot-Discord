/**
 * @ Author: Hikaru
 * @ Create Time: 2023-02-08 16:31:20
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-12 18:37:28
 * @ Description: i@rua.moe
 */

import { matchRoutes } from '@umijs/max';
import * as dotenv from 'dotenv';
import JavaScriptObfuscator from 'javascript-obfuscator';
import { SITE_CONFIG } from './constants/config';

export async function getInitialState(): Promise<{ name: string }> {
  dotenv.config();
  return { name: '@umijs/max' };
}

export function onRouteChange({ clientRoutes, location }: any) {
  // Anti Debug
  JavaScriptObfuscator.obfuscate(
    `
        (function(){
            var variable1 = '5' - 3;
            var variable2 = '5' + 3;
            var variable3 = '5' + - '2';
            var variable4 = ['10','10','10','10','10'].map(parseInt);
            var variable5 = 'foo ' + 1 + 1;
        })();
    `,
    {
      compact: true,
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 1,
      numbersToExpressions: true,
      simplify: true,
      stringArrayShuffle: true,
      splitStrings: true,
      stringArrayThreshold: 1,
    },
  );

  console.log(
    '\n %c Made with ❤️ by Nepbot %c Dev: Hikaru(i@rua.moe) \n\n',
    'color: #8C97FF; background: #fff; padding:5px 0;',
    'background: #8C97FF; padding:5px 0;',
  );

  document.oncontextmenu = function (e) {
    return false;
  };
  function block() {
    setInterval(() => {
      Function('debugger')();
    }, 50);
  }
  try {
    block();
  } catch (err) {}

  const route: any = matchRoutes(clientRoutes, location.pathname)?.pop()?.route;
  if (route) {
    document.title = route.title
      ? `${route.title} | ${SITE_CONFIG.abbr}`
      : SITE_CONFIG.title;
  }
}
