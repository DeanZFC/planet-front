import { post } from "@/utils/request.js";

/**
 * 获取验证码
 * @param data
 */
export const getCaptcha = (data) => {
  return post("/base/captcha", data);
};
