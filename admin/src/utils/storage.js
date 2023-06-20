import { isNull } from "@/utils/validate";
import global from "@/constant/global";

const keyPrefix = global.keyPrefix + "-";
/**
 * 存储Storage
 */
export const setStorage = (params = {}) => {
  let { name, content, type } = params;
  name = keyPrefix + name;
  let obj = {
    dataType: typeof content,
    content: content,
    type: type,
    datetime: new Date().getTime(),
  };
  if (type === "session") {
    window.sessionStorage.setItem(name, JSON.stringify(obj));
  } else {
    window.localStorage.setItem(name, JSON.stringify(obj));
  }
};
/**
 * 获取storage
 */

export const getStorage = (params = {}) => {
  let { name, type } = params;
  name = keyPrefix + name;
  let obj, content;
  if (type === "session") {
    obj = window.sessionStorage.getItem(name);
  } else {
    obj = window.localStorage.getItem(name);
  }
  if (isNull(obj)) {
    return;
  }

  try {
    obj = JSON.parse(obj);
  } catch {
    return obj;
  }

  if (obj.dataType === "string") {
    content = obj.content;
  } else if (obj.dataType === "number") {
    content = Number(obj.content);
  } else if (obj.dataType === "boolean") {
    content = eval(obj.content);
  } else if (obj.dataType === "object") {
    content = obj.content;
  }
  return content;
};
/**
 * 删除localStorage
 */
export const removeStorage = (params = {}) => {
  let { name, type } = params;
  name = keyPrefix + name;
  if (type) {
    window.sessionStorage.removeItem(name);
  } else {
    window.localStorage.removeItem(name);
  }
};

/**
 * 获取全部localStorage
 */
export const getAllStorage = (params = {}) => {
  let list = [];
  let { type } = params;
  if (type === "session") {
    for (let i = 0; i <= window.sessionStorage.length; i++) {
      list.push({
        name: window.sessionStorage.key(i),
        content: getStorage({
          name: window.sessionStorage.key(i),
          type: "session",
        }),
      });
    }
  } else {
    for (let i = 0; i <= window.localStorage.length; i++) {
      list.push({
        name: window.localStorage.key(i),
        content: getStorage({
          name: window.localStorage.key(i),
        }),
      });
    }
  }
  return list;
};

/**
 * 清空全部localStorage
 */
export const clearStore = (params = {}) => {
  let { type } = params;
  if (type === "session") {
    window.sessionStorage.clear();
  } else {
    window.localStorage.clear();
  }
};
