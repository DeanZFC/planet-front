import { post } from "@/utils/request.js";

export const listMenu = () => {
  return post("/menu/getMenu");
};
