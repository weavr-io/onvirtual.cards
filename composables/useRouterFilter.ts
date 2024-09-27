import dot from 'dot-object'

export const useRouterFilter = () => {
    const route = useRoute()
    const router = useRouter()

    const _dot = (_queries) => {
        return dot.dot(_queries)
    }

    const dotFilters = (_filters) => {
        return _dot({ filters: _filters })
    }

    const setFilters = (_filters) => {
        let _query = dot.object(route.query)
        delete _query.filters
        delete _query.offset

        if (Object.keys(_filters).length > 0) {
            _query = { ..._query, ...dotFilters(_filters) }
        }

        router.push({
            path: route.path,
            query: _query,
        })
    }

    const getOffset = (_page: number, _limit: number) => {
        return (_page - 1) * _limit
    }

    const generatePageLink = (_page: number, _limit: number) => {
        const _offset = _page === 1 ? 0 : getOffset(_page, _limit)

        return generateLink({ ..._dot(route.query), offset: _offset })
    }

    const generateLink = (_queries) => {
        return (
            '?' +
            Object.keys(_queries)
                .map((key) => key + '=' + _queries[key])
                .join('&')
        )
    }

    const getPage = (_offset: number, _limit: number) => {
        return !_offset || _offset === 0 ? 1 : 1 + _offset / _limit
    }

    const getNumberOfPages = (_count: number, _limit: number) => {
        return Math.ceil(_count / _limit)
    }

    const getPreviousLink = (_currentPage: number, _limit: number) => {
        if (_currentPage === 1) return null

        return generatePageLink(_currentPage - 1, _limit)
    }

    const getNextLink = (_currentPage: number, _limit: number, _numberOfPages: number) => {
        if (_currentPage === _numberOfPages) return null

        return generatePageLink(_currentPage + 1, _limit)
    }

    const changePage = (_val: string, _numberOfPages: number, _limit: number) => {
        const _valNumber = parseInt(_val)
        let _currentPage = _valNumber

        if (_valNumber < 1) {
            _currentPage = 1
        } else if (_valNumber > _numberOfPages) {
            _currentPage = _numberOfPages
        } else {
            _currentPage = _valNumber
        }

        const _queries = { ...route.query, offset: getOffset(_currentPage, _limit) + '' }

        router.push({ path: route.path, query: _queries })
    }

    return { setFilters, getPage, getNumberOfPages, getPreviousLink, getNextLink, changePage }
}
