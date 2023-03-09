import { useBase } from '~/composables/useBase'
import { computed } from '~/node_modules/vue'

export function useRouter() {
  const _dot = require('dot-object')

  const { router } = useBase()

  const path = computed(() => {
    return router.path
  })

  const query = computed(() => {
    return router.query
  })

  function dot(_queries) {
    return _dot.dot(_queries)
  }

  function dotFilters(_filters) {
    return dot({ filters: _filters })
  }

  function setFilters(_filters) {
    let _query = _dot.object(query.value)
    delete _query.filters
    delete _query.offset

    if (Object.keys(_filters).length > 0) {
      _query = { ..._query, ...dotFilters(_filters) }
    }

    router.push({
      path: path.value,
      query: _query,
    })
  }

  return {
    path,
    query,
    setFilters,
  }
}
