import axios from "axios"; // 引入axios
import { ElMessage, ElMessageBox } from "element-plus";
import { useUserStore } from "@/pinia/modules/user";
import { emitter } from "@/utils/bus.js";
import router from "@/router/index";
import { getToken } from "@/utils/auth.js";
import { serialize } from "@/utils/common.js";
import qs from "qs";

/**
 * 全站http配置
 *
 * axios参数说明
 * isSerialize是否开启form表单提交
 * isToken是否需要token
 */
const _axios = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 99999,
});
let activeAxios = 0;
let timer;
const showLoading = () => {
  activeAxios++;
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(() => {
    if (activeAxios > 0) {
      emitter.emit("showLoading");
    }
  }, 400);
};

const closeLoading = () => {
  activeAxios--;
  if (activeAxios <= 0) {
    clearTimeout(timer);
    emitter.emit("closeLoading");
  }
};
// http request 拦截器
_axios.interceptors.request.use(
  (config) => {
    const meta = config["meta"] || {};
    //为空或者true显示加载动画
    if (meta["showLoading"] !== false) {
      showLoading();
    }
    const isToken = !meta["isToken"] || meta["isToken"] === true;

    if (isToken) {
      const userStore = useUserStore();
      let token = getToken();
      config.headers["Authorization"] = "Bearer " + token;
      config.headers["x-token"] = token;
      config.headers["x-user-id"] = userStore.userInfo.ID;
    }

    //headers中配置serialize为true开启序列化
    if (config.method === "post" && meta["isSerialize"] === true) {
      Object.keys(config.data).forEach((ele) => {
        if (!config.data[ele]) {
          delete config.data[ele];
        }
      });
      config.data = serialize(config.data);
    }
    //只针对get方式进行序列化
    if (config.method === "get") {
      config.paramsSerializer = function (params) {
        return encodeURI(
          qs.stringify(params, { allowDots: true, encode: false })
        );
      };
    }

    return config;
  },
  (error) => {
    if (error.config["meta"]["showLoading"] !== false) {
      closeLoading();
    }
    ElMessage({ showClose: true, message: error, type: "error" });
    return error;
  }
);

// http response 拦截器
_axios.interceptors.response.use(
  (response) => {
    const meta = response.config["meta"] || {};
    const status = Number(response.status) || 200;
    const data = response.data;
    const message = data.msg || "未知错误";
    const code = data.code || 500;

    const userStore = useUserStore();

    if (meta["showLoading"] !== false) {
      closeLoading();
    }

    if (status === 401 || code === 403 || code === 401 || code === 403) {
      ElMessage({
        showClose: true,
        message: message || decodeURI(response.headers["msg"]),
        type: "error",
      });
      userStore.clearToken();
      router.push({ name: "login", replace: true }).then(() => {});
    }
    if (code !== 200) {
      ElMessage({
        type: "error",
        message: message,
        showClose: true,
      });
    }

    return data;
  },
  (error) => {
    const meta = error.config["meta"] || {};
    if (meta["showLoading"] !== false) {
      closeLoading();
    }

    if (!error.response) {
      ElMessageBox.confirm(
        `
        <p>检测到请求错误</p>
        <p>${error}</p>
        `,
        "请求报错",
        {
          dangerouslyUseHTMLString: true,
          distinguishCancelAndClose: true,
          confirmButtonText: "稍后重试",
          cancelButtonText: "取消",
        }
      ).then(() => {});
      return;
    }

    switch (error.response.status) {
      case 500:
        ElMessageBox.confirm(
          `
        <p>检测到接口错误${error}</p>
        <p>错误码<span style="color:red"> 500 </span>：此类错误内容常见于后台panic，请先查看后台日志，如果影响您正常使用可强制登出清理缓存</p>
        `,
          "接口报错",
          {
            dangerouslyUseHTMLString: true,
            distinguishCancelAndClose: true,
            confirmButtonText: "清理缓存",
            cancelButtonText: "取消",
          }
        ).then(() => {});
        break;
      case 404:
        ElMessageBox.confirm(
          `
          <p>检测到接口错误${error}</p>
          <p>错误码<span style="color:red"> 404 </span></p>
          `,
          "接口报错",
          {
            dangerouslyUseHTMLString: true,
            distinguishCancelAndClose: true,
            confirmButtonText: "我知道了",
            cancelButtonText: "取消",
          }
        ).then(() => {});
        break;
    }

    return error;
  }
);
export default _axios;

export const get = (url, params = {}, config = {}) => {
  return _axios({
    url,
    params,
    method: "get",
    ...config,
  });
};

export const post = (url, data = {}, config = {}) => {
  return _axios({
    url,
    data,
    method: "post",
    ...config,
  });
};
