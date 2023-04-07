/**
 * @ Author: Hikaru
 * @ Create Time: 2023-02-08 16:31:20
 * @ Modified by: Hikaru
 * @ Modified time: 2023-04-07 15:36:38
 * @ Description: i@rua.moe
 */

import { matchRoutes } from '@umijs/max';
import { SITE_CONFIG } from './constants/config';

export async function getInitialState(): Promise<{ name: string }> {
  return { name: '@umijs/max' };
}

export function onRouteChange({ clientRoutes, location }: any) {
  // // Anti Debug
  // console.log(
  //   '\n %c Made with ❤️ by Nepbot %c Dev: Hikaru(i@rua.moe) \n\n',
  //   'color: #8C97FF; background: #fff; padding:5px 0;',
  //   'background: #8C97FF; padding:5px 0;',
  // );

  // function block() {
  //   setInterval(() => {
  //     Function('debugger')();
  //   }, 50);
  // }
  // try {
  //   block();
  // } catch (err) {}

  const route: any = matchRoutes(clientRoutes, location.pathname)?.pop()?.route;
  if (route) {
    document.title = route.title
      ? `${route.title} | ${SITE_CONFIG.abbr}`
      : SITE_CONFIG.title;
  }
}
