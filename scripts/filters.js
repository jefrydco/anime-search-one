import { BASE_API_URL } from './constant.js'
import { toQueryParams } from './utils.js'

function fetchFilterBase(filter) {
  return fetch(`${BASE_API_URL}${filter}`).then((_) => (_.ok ? _.json() : null))
}

export function fetchSortBy() {
  return fetchFilterBase('/sortby')
}

export function fetchDuration() {
  return fetchFilterBase('/duration')
}

export function fetchGenres() {
  return fetchFilterBase('/genres')
}

export function fetchLicensors() {
  return fetchFilterBase('/licensors')
}

export function fetchProducers() {
  return fetchFilterBase('/producers')
}

export function fetchRating() {
  return fetchFilterBase('/rating')
}

export function fetchType() {
  return fetchFilterBase('/type')
}

export function fetchAnime(filters) {
  const queryParams = toQueryParams(filters)
  return fetchFilterBase(`/anime?${queryParams}`)
}

export function fetchAnimePagination(slug) {
  return fetchFilterBase(slug)
}
