import dayjs from 'https://unpkg.com/dayjs@1.10.4/esm/index.js'

import { PLEASE_SELECT_ONE } from './constant.js'

import { isObject } from './utils.js'

export function generateOptions(data) {
  const html = data.data
    .map((datum) => `<option value="${datum}">${datum}</option>`)
    .join('')
  return `${PLEASE_SELECT_ONE}${html}`
}

export function generateSearchInfo(data) {
  return `Page ${data.page} from ${data.total} search result`
}

function generateTableColumn(value) {
  if (Array.isArray(value)) {
    return value.join(', ')
  }
  if (isObject(value)) {
    if (value.startDate && !value.endDate) {
      return dayjs(value.startDate).format('DD MMM YYYY')
    }
    return `${dayjs(value.startDate).format('DD MMM YYYY')} to ${dayjs(
      value.endDate
    ).format('DD MMM YYYY')}`
  }
  return value
}

export function generateTableBody(data) {
  return data
    .map(
      (item, i) =>
        `<tr class="${
          i % 2 === 0 ? 'bg-blue-100' : 'bg-blue-200'
        }"><td class="p-3"><a class="hover:text-blue-600 hover:underline text-blue-500 font-medium" href="https://myanimelist.net/anime/${
          item.MAL_ID
        }/" target="_blank" rel="noopener noreferrer">Link</td>${Object.entries(item)
          .map(
            ([key, value]) =>
              `<td class="p-3 ${
                typeof value === 'number' || key === 'Episodes'
                  ? 'text-right'
                  : ''
              }">${generateTableColumn(value)}</td>`
          )
          .join('')}</tr>`
    )
    .join('')
}
