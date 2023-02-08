/**
 * @ Author: Hikaru
 * @ Create Time: 2023-02-08 01:35:14
 * @ Modified by: Hikaru
 * @ Modified time: 2023-02-08 02:51:31
 * @ Description: i@rua.moe
 */

import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "index" },
    { path: "/docs", component: "docs" },
  ],
  npmClient: 'yarn',
});
