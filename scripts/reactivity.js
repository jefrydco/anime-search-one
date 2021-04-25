import { isObject } from './utils.js'
import { get } from './libs/dot-prop.js'

const targetMap = new WeakMap()
let activeEffect

export function reactive(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      const value = get(target, key)

      track(target, key)

      if (isObject(value)) {
        return reactive(value)
      }
      if (Array.isArray(value)) {
        return trackArray(target, key)
      }

      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
      trigger(target, key, value)

      return Reflect.set(target, key, value, receiver)
    }
  })
}


function track(target, key) {
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }

  if (!dep.has(activeEffect) && typeof activeEffect !== 'undefined') {
    dep.add(activeEffect)
  }

  targetMap.set(target, depsMap)
}

function trackArray(target, key) {
  const value = target[key]

  return new Proxy(value, {
    get(arrayTarget, arrayKey, arrReceiver) {
      const arrayMethod = arrayTarget[arrayKey]

      if (typeof arrayMethod === 'function') {
        if (
          ['push', 'unshift', 'pop', 'shift', 'splice', 'slice'].includes(
            arrayKey
          )
        ) {
          return function () {
            const result = Array.prototype[arrayKey].apply(
              arrayTarget,
              arguments
            )

            trigger(target, key, value)

            return result
          }
        }
        return arrayMethod.bind(arrayTarget)
      }
      return arrayMethod
    }
  })
}

function trigger(target, key, value) {
  const effects = targetMap.get(target).get(key)
  if (effects) {
    effects.forEach((effect) => {
      effect(value)
    })
  }
}

export function watch(target, key, effect) {
  activeEffect = effect
  const value = get(target, key)
  effect(value)
  activeEffect = undefined
}
