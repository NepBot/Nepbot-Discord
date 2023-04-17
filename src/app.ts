/**
 * @ Author: Hikaru
 * @ Create Time: 2023-02-08 16:31:20
 * @ Modified by: Hikaru
 * @ Modified time: 2023-04-08 02:35:12
 * @ Description: 
 */

import { matchRoutes } from '@umijs/max';
import { SITE_CONFIG } from './constants/config';

export async function getInitialState(): Promise<{ name: string }> {
  return { name: '@umijs/max' };
}

export function onRouteChange({ clientRoutes, location }: any) {

  const route: any = matchRoutes(clientRoutes, location.pathname)?.pop()?.route;
  if (route) {
    document.title = route.title
      ? `${route.title} | ${SITE_CONFIG.abbr}`
      : SITE_CONFIG.title;
  }
}
