import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import * as path from "path";
import * as dotenv from "dotenv";
import * as fs from "fs";
// https://vitejs.dev/config/
export default defineConfig(() => {
  //将环境变量读取到process.env中
  const NODE_ENV = process.env.NODE_ENV || "development";
  const envFiles = [`.env.${NODE_ENV}`];
  for (const file of envFiles) {
    const envConfig = dotenv.parse(fs.readFileSync(file));
    for (const k in envConfig) {
      process.env[k] = envConfig[k];
    }
  }

  //别名
  const alias = {
    "@": path.resolve(__dirname, "./src"),
  };

  return {
    plugins: [vue()],
    resolve: {
      alias,
    },
    server: {
      // 如果使用docker-compose开发模式，设置为false
      open: true,
      port: process.env.VITE_CLI_PORT,
      proxy: {
        // 把key的路径代理到target位置
        [process.env.VITE_BASE_API]: {
          // 需要代理的路径   例如 '/api'
          target: `${process.env.VITE_BASE_PATH}:${process.env.VITE_SERVER_PORT}/`, // 代理到 目标路径
          changeOrigin: true,
          rewrite: (path) =>
            path.replace(new RegExp("^" + process.env.VITE_BASE_API), ""),
        },
      },
    },
  };
});
