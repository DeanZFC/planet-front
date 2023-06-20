import { useUserStore } from "@/pinia/modules/user.js";
import { useRouterStore } from "@/pinia/modules/router.js";
import router from "@/router/index.js";
import Nprogress from "nprogress";
import global from "@/constant/global.js";

async function handleKeepAlive(to) {
  if (to.matched.some((item) => item.meta.keepAlive)) {
    if (to.matched && to.matched.length > 2) {
      for (let i = 1; i < to.matched.length; i++) {
        const element = to.matched[i - 1];
        if (element.name === "layout") {
          to.matched.splice(i, 1);
          await handleKeepAlive(to);
        }
        // 如果没有按需加载完成则等待加载
        if (typeof element.components.default === "function") {
          await element.components.default();
          await handleKeepAlive(to);
        }
      }
    }
  }
}

router.beforeEach(async (to, from, next) => {
  Nprogress.start();
  to.meta.matched = [...to.matched];
  await handleKeepAlive(to);

  // 白名单直接放行
  if (global.whiteList && global.whiteList.indexOf(to.name) > -1) {
    next();
  }

  const routerStore = useRouterStore();
  const userStore = useUserStore();
  const token = userStore.token;

  //如果token存在
  if (token) {
    // 如果路由未加载，则加载路由
    if (!routerStore.asyncRouterFlag) {
      await routerStore.setAsyncRouter();
    }

    // 如果用户信息不存在，则获取用户信息
    if (!userStore.userInfo || JSON.stringify(userStore.userInfo) === "{}") {
      const userInfo = await userStore.getUserInfo();
      if (!userInfo) {
        // 获取失败退出账号，跳转登录页面
        userStore.clearStorage();
        next({
          name: global.loginRouter,
          query: {
            redirect: document.location.hash,
          },
        });
      }
    }

    // 如果存在token且是跳转登录也，则直接跳转用户信息中的默认路由
    if (
      global.loginRouter === to.name &&
      userStore.userInfo?.authority?.defaultRouter != null
    ) {
      next({ name: userStore.userInfo.authority.defaultRouter });
    } else {
      next();
    }
  } else {
    // 未登录，跳转登录页面
    next({
      name: global.loginRouter,
      query: {
        redirect: document.location.hash,
      },
    });
  }
});

router.afterEach(() => {
  // 路由加载完成后关闭进度条
  document.getElementsByClassName("main-cont main-right")[0]?.scrollTo(0, 0);
  Nprogress.done();
});

router.onError(() => {
  // 路由发生错误后销毁进度条
  Nprogress.remove();
});
