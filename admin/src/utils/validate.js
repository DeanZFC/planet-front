/**
 * 判断是否为空
 */
export function isNull(val) {
  if (typeof val == "boolean") {
    return false;
  }
  if (typeof val == "number") {
    return false;
  }
  if (val instanceof Array) {
    if (val.length === 0) {
      return true;
    }
  } else if (val instanceof Object) {
    if (JSON.stringify(val) === "{}") {
      return true;
    }
  } else {
    return (
      val === "null" ||
      val == null ||
      val === "undefined" ||
      val === undefined ||
      val === ""
    );
  }
  return false;
}
