import { registerIcon } from "@/config/icon";
import websiteConfig from "@/config/website.js";

/**
 * 加载admin配置文件
 */

export default {
  install: (app) => {
    // 注册el-icon图标
    registerIcon(app);

    // 注册全局常量
    app.config.globalProperties.$ADMIN = websiteConfig;

    console.log(`
       欢迎使用 Admin
    `);
  },
};
