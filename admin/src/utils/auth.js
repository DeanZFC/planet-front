import { getStorage, removeStorage, setStorage } from "@/utils/storage";

const tokenKey = "token"; //key值

export const getToken = () => {
  return getStorage({ name: tokenKey });
};

export const setToken = (token) => {
  setStorage({ name: tokenKey, content: token });
};

export const removeToken = () => {
  removeStorage({ name: tokenKey });
};
