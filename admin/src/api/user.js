import { post } from "@/utils/request.js";

export const login = (data) => {
  return post("/base/login", data);
};

export const getUserInfo = () => {
  return get("/user/getUserInfo");
};

export const setUserAuthority = (data) => {
  return post("", data);
};
