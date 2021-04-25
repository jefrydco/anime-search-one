import pDebounce from 'https://unpkg.com/p-debounce@3.0.2/index.js'

import {
  fetchSortBy,
  fetchDuration,
  fetchGenres,
  fetchLicensors,
  fetchProducers,
  fetchRating,
  fetchType,
  fetchAnime,
  fetchAnimePagination
} from './filters.js'
import { reactive, watch } from './reactivity.js'
import { select } from './select.js'
import { formatQueryParams, nextTick } from './utils.js'
import {
  generateTableBody,
  generateOptions,
  generateSearchInfo
} from './template.js'

async function main() {
  const [
    sortBy,
    duration,
    genres,
    licensors,
    producers,
    rating,
    type
  ] = await Promise.all([
    fetchSortBy(),
    fetchDuration(),
    fetchGenres(),
    fetchLicensors(),
    fetchProducers(),
    fetchRating(),
    fetchType()
  ])

  const state = reactive({
    animeList: [],
    keyword: '',
    filter: {
      size: '10',
      sort: 'asc',
      sortBy: '',
      duration: '',
      genres: '',
      licensors: '',
      producers: '',
      rating: '',
      type: ''
    },
    pagination: {
      first: null,
      prev: null,
      next: null,
      last: null,
      page: null,
      total: null
    }
  })

  window.state = state

  async function fetchAnimeWithFilter(slug) {
    const filter = formatQueryParams(state.filter)

    try {
      select('#progress', (el) => {
        el.classList.add('opacity-100')
      })
      if (slug) {
        const anime = await fetchAnimePagination(slug)
        state.pagination.first = anime.first
        state.pagination.prev = anime.prev
        state.pagination.next = anime.next
        state.pagination.last = anime.last
        state.pagination.page = anime.page
        state.pagination.total = anime.total
        state.animeList = anime.data
      } else {
        const anime = await fetchAnime({
          ...filter,
          q: state.keyword
        })
        state.pagination.first = anime.first
        state.pagination.prev = anime.prev
        state.pagination.next = anime.next
        state.pagination.last = anime.last
        state.pagination.page = anime.page
        state.pagination.total = anime.total
        state.animeList = anime.data
      }
    } catch (error) {
      // TODO: Add error handling
    } finally {
      select('#progress', (el) => {
        el.classList.remove('opacity-100')
      })
    }
  }
  const fetchAnimeWithFilterDebounced = pDebounce(fetchAnimeWithFilter , 150)

  watch(state, 'animeList', (value) => {
    select('#result tbody', (el) => {
      const html = generateTableBody(value)
      el.innerHTML = html
    })
  })
  watch(state, 'keyword', (value) => {
    select('#keyword', (el) => {
      el.value = value
    })

    if (value.length === 0 || value.length >= 3) {
      select('#keyword-info', (el) => {
        el.classList.add('hidden')
      })
      fetchAnimeWithFilterDebounced()
    } else {
      select('#keyword-info', (el) => {
        el.classList.remove('hidden')
        el.classList.add('block')
      })
    }
  })
  watch(state, 'filter.size', (value) => {
    select('#size', (el) => {
      if (el.value !== value) {
        el.value = value
      }
    })
    fetchAnimeWithFilterDebounced()
  })
  watch(state, 'filter.sort', (value) => {
    select('#sort', (el) => {
      if (el.value !== value) {
        el.value = value
      }
    })
    fetchAnimeWithFilterDebounced()
  })
  watch(state, 'filter.sortBy', (value) => {
    select('#sortby', (el) => {
      if (el.value !== value) {
        el.value = value
      }
    })
    fetchAnimeWithFilterDebounced()
  })
  watch(state, 'filter.duration', (value) => {
    select('#duration', (el) => {
      if (el.value !== value) {
        el.value = value
      }
    })
    fetchAnimeWithFilterDebounced()
  })
  watch(state, 'filter.genres', (value) => {
    select('#genres', (el) => {
      if (el.value !== value) {
        el.value = value
      }
    })
    fetchAnimeWithFilterDebounced()
  })
  watch(state, 'filter.licensors', (value) => {
    select('#licensors', (el) => {
      if (el.value !== value) {
        el.value = value
      }
    })
    fetchAnimeWithFilterDebounced()
  })
  watch(state, 'filter.producers', (value) => {
    select('#producers', (el) => {
      if (el.value !== value) {
        el.value = value
      }
    })
    fetchAnimeWithFilterDebounced()
  })
  watch(state, 'filter.rating', (value) => {
    select('#rating', (el) => {
      if (el.value !== value) {
        el.value = value
      }
    })
    fetchAnimeWithFilterDebounced()
  })
  watch(state, 'filter.type', (value) => {
    select('#type', (el) => {
      if (el.value !== value) {
        el.value = value
      }
    })
    fetchAnimeWithFilterDebounced()
  })
  watch(state, 'pagination.first', (value) => {
    select('#first', (el) => {
      el.disabled = !value
    })
  })
  watch(state, 'pagination.prev', (value) => {
    select('#prev', (el) => {
      el.disabled = !value
    })
  })
  watch(state, 'pagination.next', (value) => {
    select('#next', (el) => {
      el.disabled = !value
    })
  })
  watch(state, 'pagination.last', (value) => {
    select('#last', (el) => {
      el.disabled = !value
    })
  })
  watch(state, 'pagination.page', (value) => {
    nextTick(() => {
      select('#search-info', (el) => {
        if (state.pagination.page && state.pagination.total) {
          el.innerText = generateSearchInfo(state.pagination)
        }
      })
    })
  })
  watch(state, 'pagination.total', (value) => {
    nextTick(() => {
      select('#search-info', (el) => {
        if (state.pagination.page && state.pagination.total) {
          el.innerText = generateSearchInfo(state.pagination)
        }
      })
    })
  })

  select('#keyword', (el) => {
    el.addEventListener('input', (e) => {
      state.keyword = e.target.value
    })
  })
  select('#size', (el) => {
    el.addEventListener('change', (e) => {
      state.filter.size = e.target.value
    })
  })
  select('#sort', (el) => {
    el.addEventListener('change', (e) => {
      state.filter.sort = e.target.value
    })
  })
  select('#sortby', (el) => {
    const html = generateOptions(sortBy)
    el.innerHTML = html

    el.addEventListener('change', (e) => {
      state.filter.sortBy = e.target.value
    })
  })
  select('#duration', (el) => {
    el.innerHTML = generateOptions(duration)

    el.addEventListener('change', (e) => {
      state.filter.duration = e.target.value
    })
  })
  select('#genres', (el) => {
    el.innerHTML = generateOptions(genres)

    el.addEventListener('change', (e) => {
      state.filter.genres = e.target.value
    })
  })
  select('#licensors', (el) => {
    el.innerHTML = generateOptions(licensors)

    el.addEventListener('change', (e) => {
      state.filter.licensors = e.target.value
    })
  })
  select('#producers', (el) => {
    el.innerHTML = generateOptions(producers)

    el.addEventListener('change', (e) => {
      state.filter.producers = e.target.value
    })
  })
  select('#rating', (el) => {
    el.innerHTML = generateOptions(rating)

    el.addEventListener('change', (e) => {
      state.filter.rating = e.target.value
    })
  })
  select('#type', (el) => {
    el.innerHTML = generateOptions(type)

    el.addEventListener('change', (e) => {
      state.filter.type = e.target.value
    })
  })
  select('#reset', (el) => {
    el.addEventListener('click', () => {
      state.animeList = []
      state.keyword = ''
      state.filter.size = 10
      state.filter.sort = 'asc'
      state.filter.sortBy = 'MAL_ID'
      state.filter.duration = ''
      state.filter.genres = ''
      state.filter.licensors = ''
      state.filter.producers = ''
      state.filter.rating = ''
      state.filter.type = ''
      state.pagination.first = null
      state.pagination.prev = null
      state.pagination.next = null
      state.pagination.last = null
      state.pagination.page = null
      state.pagination.total = null
    })
  })
  select('#first', (el) => {
    el.addEventListener('click', () => {
      if (state.pagination.first) {
        fetchAnimeWithFilterDebounced(state.pagination.first)
      }
    })
  })
  select('#prev', (el) => {
    el.addEventListener('click', () => {
      if (state.pagination.prev) {
        fetchAnimeWithFilterDebounced(state.pagination.prev)
      }
    })
  })
  select('#next', (el) => {
    el.addEventListener('click', () => {
      if (state.pagination.next) {
        fetchAnimeWithFilterDebounced(state.pagination.next)
      }
    })
  })
  select('#last', (el) => {
    el.addEventListener('click', () => {
      if (state.pagination.last) {
        fetchAnimeWithFilterDebounced(state.pagination.last)
      }
    })
  })
}

main()
