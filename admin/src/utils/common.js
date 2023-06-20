/**
 * 表单序列化
 */
export const serialize = (data) => {
  let list = []
  Object.keys(data).forEach((ele) => {
    list.push(`${ele}=${data[ele]}`)
  })
  return list.join('&')
}

/**
 * 获取对象类型
 */
export const getObjType = (obj) => {
  const toString = Object.prototype.toString
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object',
  }
  if (obj instanceof Element) {
    return 'element'
  }
  return map[toString.call(obj)]
}

/**
 * 对象深拷贝
 */
export const deepClone = (data) => {
  const type = getObjType(data)
  let obj
  if (type === 'array') {
    obj = []
  } else if (type === 'object') {
    obj = {}
  } else {
    //不再具有下一层次
    return data
  }
  if (type === 'array') {
    for (let i = 0, len = data.length; i < len; i++) {
      obj.push(deepClone(data[i]))
    }
  } else if (type === 'object') {
    for (let key in data) {
      if (data.hasOwnProperty.call(key)) {
        obj[key] = deepClone(data[key])
      }
    }
  }
  return obj
}

/**
 * 获取url中的参数
 * @param urlStr
 * @param name
 */
export const getUrlParam = (urlStr, name) => {
  const params = urlStr.split('?')[1]
  if (!params) return null
  const re = /[?&]?([^=]+)=([^&]*)/g
  let tokens
  while ((tokens = re.exec(params))) {
    if (decodeURIComponent(tokens[1]) === name) {
      return decodeURIComponent(tokens[2])
    }
  }
  return null
}
