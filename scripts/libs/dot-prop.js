// Taken from: https://github.com/sindresorhus/dot-prop/blob/09adad91e5a5072014b3380e769be8aae89738f2/index.js
import { isObject } from '../utils.js'

const disallowedKeys = new Set(['__proto__', 'prototype', 'constructor'])

const isValidPath = (pathSegments) =>
  !pathSegments.some((segment) => disallowedKeys.has(segment))

function getPathSegments(path) {
  const pathArray = path.split('.')
  const parts = []

  for (let i = 0; i < pathArray.length; i++) {
    let p = pathArray[i]

    while (p[p.length - 1] === '\\' && pathArray[i + 1] !== undefined) {
      p = p.slice(0, -1) + '.'
      p += pathArray[++i]
    }

    parts.push(p)
  }

  if (!isValidPath(parts)) {
    return []
  }

  return parts
}

export function get(object, path, value) {
  if (!isObject(object) || typeof path !== 'string') {
    return value === undefined ? object : value
  }

  const pathArray = getPathSegments(path)
  if (pathArray.length === 0) {
    return
  }

  for (let i = 0; i < pathArray.length; i++) {
    object = object[pathArray[i]]

    if (object === undefined || object === null) {
      // `object` is either `undefined` or `null` so we want to stop the loop, and
      // if this is not the last bit of the path, and
      // if it did't return `undefined`
      // it would return `null` if `object` is `null`
      // but we want `get({foo: null}, 'foo.bar')` to equal `undefined`, or the supplied value, not `null`
      if (i !== pathArray.length - 1) {
        return value
      }

      break
    }
  }

  return object === undefined ? value : object
}
