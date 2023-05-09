import { computed, reactive } from '~/node_modules/vue'

export function useRouter(root) {
    const _dot = require('dot-object')

    const path = computed(() => {
        return root.$route.path
    })

    const query = computed(() => {
        return root.$route.query
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

        root.$router.push({
            path: path.value,
            query: _query,
        })
    }

    const unRefs = reactive({ path, query })

    return {
        path,
        query,
        setFilters,
        unRefs,
    }
}
