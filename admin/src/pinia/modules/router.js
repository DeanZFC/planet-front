import { defineStore } from "pinia";
import { listMenu } from "@/api/menu.js";
import { formatRouter, asyncRouterHandle } from "@/utils/asyncRouter.js";
import _router from "@/router/index.js";

const notLayoutRouterArr = [];
const keepAliveRoutersArr = [];
const nameMap = {};

const KeepAliveFilter = (routes) => {
  routes &&
    routes.forEach((item) => {
      // 子菜单中有 keep-alive 的，父菜单也必须 keep-alive，否则无效。这里将子菜单中有 keep-alive 的父菜单也加入。
      if (
        (item.children && item.children.some((ch) => ch.meta.keepAlive)) ||
        item.meta.keepAlive
      ) {
        item.component &&
          item.component().then((val) => {
            keepAliveRoutersArr.push(val.default.name);
            nameMap[item.name] = val.default.name;
          });
      }
      if (item.children && item.children.length > 0) {
        KeepAliveFilter(item.children);
      }
    });
};

export const useRouterStore = defineStore("router", {
  state: () => ({
    asyncRouters: [],
    keepAliveRouters: [],
    asyncRouterFlag: false,
    routeMap: {},
  }),

  getters: {},

  actions: {
    /**
     * 设置KeepAlive
     * @param history
     */
    setKeepAliveRouters(history) {
      const keepArrTemp = [];
      history.forEach((item) => {
        if (nameMap[item.name]) {
          keepArrTemp.push(nameMap[item.name]);
        }
      });
      this.keepAliveRouters = Array.from(new Set(keepArrTemp));
    },

    /**
     * 设置动态路由
     * @returns {Promise<boolean>}
     */
    async setAsyncRouter() {
      this.asyncRouterFlag = true;
      const baseRouter = [
        {
          path: "/layout",
          name: "layout",
          component: "view/layout/index.vue",
          meta: {
            title: "底层layout",
          },
          children: [],
        },
      ];
      const asyncRouterRes = await listMenu();
      const asyncRouters = asyncRouterRes.data.menus;
      asyncRouters &&
        asyncRouters.push({
          path: "reload",
          name: "Reload",
          hidden: true,
          meta: {
            title: "",
            closeTab: true,
          },
          component: "view/error/reload.vue",
        });
      const notLayoutRouterArr = [];
      formatRouter(asyncRouters, this.routeMap, notLayoutRouterArr);
      baseRouter[0].children = asyncRouters;
      if (notLayoutRouterArr.length !== 0) {
        baseRouter.push(...notLayoutRouterArr);
      }
      asyncRouterHandle(baseRouter);
      KeepAliveFilter(asyncRouters);
      this.asyncRouters = baseRouter;
      baseRouter.forEach((asyncRouter) => {
        _router.addRoute(asyncRouter);
      });
      return true;
    },
  },
});
