export function nextTick(callback) {
  setTimeout(callback, 0)
}

export function toQueryParams(object) {
  const queryParams = new URLSearchParams()
  Object.entries(object).forEach(([key, value]) => {
    if (value) {
      queryParams.append(key, value)
    }
  })
  return queryParams.toString()
}

export function formatQueryParams(state) {
  return Object.entries(state).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: value
    }),
    {}
  )
}

export function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]'
}
