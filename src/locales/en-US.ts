/**
 * @ Author: Hikaru
 * @ Create Time: 2023-02-08 16:03:12
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-30 03:32:29
 * @ Description: i@rua.moe
 */

import collection from './en-US/collection';
import connect from './en-US/connect';
import header from './en-US/header';
import home from './en-US/home';
import mint from './en-US/mint';
import platform from './en-US/platform';
import role from './en-US/role';
import special from './en-US/special';

export default {
  ...header,
  ...home,
  ...connect,
  ...role,
  ...mint,
  ...platform,
  ...collection,
  ...special,
};
