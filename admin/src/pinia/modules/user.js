import { defineStore } from "pinia";
import { getToken, removeToken, setToken } from "@/utils/auth.js";
import { ref } from "vue";
import { getUserInfo, login as loginApi } from "@/api/user.js";
import { ElLoading } from "element-plus";
import { useRouterStore } from "@/pinia/modules/router.js";
import { clearStore } from "@/utils/storage.js";

export const useUserStore = defineStore("user", {
  state: () => ({
    loadingInstance: null,
    token: getToken(),
    userInfo: {},
  }),

  getters: {
    mode: (state) => state.userInfo.sideMode,
    sideMode: (state) => {
      if (state.userInfo.sideMode === "dark") {
        return "#191a23";
      } else if (state.userInfo.sideMode === "light") {
        return "#fff";
      } else {
        return state.userInfo.sideMode;
      }
    },
  },

  actions: {
    /**
     * 登录
     * @param loginInfo
     * @returns {Promise<boolean>}
     * @constructor
     */
    async login(loginInfo) {
      this.loadingInstance = ElLoading.service({
        fullscreen: true,
        text: "登录中，请稍候...",
      });
      try {
        const res = await loginApi(loginInfo);
        if (res.code === 200) {
          const data = res.data;
          this.userInfo = data.user;
          this.token = data.token;
          setToken(data.token);

          const routerStore = useRouterStore();
          await routerStore.setAsyncRouter();
          return true;
        }
      } catch (err) {
        console.log("登录失败：", err);
      } finally {
        this.loadingInstance && this.loadingInstance.close();
      }
      return false;
    },

    /**
     * 获取用户信息
     * @returns {Promise<*>}
     */
    async getUserInfo() {
      const { code, data } = await getUserInfo();
      if (code !== 200 || !data.userInfo) {
        return;
      }
      this.userInfo = data.userInfo;
      return data.userInfo;
    },

    /**
     * 清除token
     */
    clearToken() {
      this.token = "";
      this.userInfo = "";
      removeToken();
    },
    clearStorage() {
      clearStore();
      clearStore({ type: "session" });
      this.clearToken();
    },
  },
});
