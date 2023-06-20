const viewModules = import.meta.glob("../view/**/*.vue");
const pluginModules = import.meta.glob("../plugin/**/*.vue");

export const formatRouter = (routes, routeMap, notLayoutRouterArr) => {
  routes &&
    routes.forEach((item) => {
      item.meta.btns = item.btns;
      item.meta.hidden = item.hidden;
      if (item.meta.defaultMenu === true) {
        notLayoutRouterArr.push({
          ...item,
          path: `/${item.path}`,
        });
      } else {
        routeMap[item.name] = item;
        if (item.children && item.children.length > 0) {
          formatRouter(item.children, routeMap, notLayoutRouterArr);
        }
      }
    });
};

export const asyncRouterHandle = (asyncRouter) => {
  asyncRouter.forEach((item) => {
    if (item.component) {
      if (item.component.split("/")[0] === "view") {
        item.component = dynamicImport(viewModules, item.component);
      } else if (item.component.split("/")[0] === "plugin") {
        item.component = dynamicImport(pluginModules, item.component);
      }
    } else {
      delete item["component"];
    }
    if (item.children) {
      asyncRouterHandle(item.children);
    }
  });
};

function dynamicImport(dynamicViewsModules, component) {
  const keys = Object.keys(dynamicViewsModules);
  const matchKeys = keys.filter((key) => {
    const k = key.replace("../", "");
    return k === component;
  });
  const matchKey = matchKeys[0];

  return dynamicViewsModules[matchKey];
}
