import { Component, Vue } from 'nuxt-property-decorator'

const dot = require('dot-object')

@Component
export default class RouterMixin extends Vue {
    get path() {
        return this.$route.path
    }

    get query() {
        return this.$route.query
    }

    public dot(_queries) {
        return dot.dot(_queries)
    }

    public dotFilters(_filters) {
        return this.dot({ filters: _filters })
    }

    public setFilters(_filters) {
        let _query = dot.object(this.query)
        delete _query.filters
        delete _query.offset

        if (Object.keys(_filters).length > 0) {
            _query = { ..._query, ...this.dotFilters(_filters) }
        }

        this.$router.push({
            path: this.path,
            query: _query,
        })
    }

    getOffset(_page: number, _limit: number) {
        return (_page - 1) * _limit
    }

    public generatePageLink(_page: number, _limit: number) {
        const _offset = _page === 1 ? 0 : this.getOffset(_page, _limit)

        return this.generateLink({ ...this.dot(this.query), offset: _offset })
    }

    public generateLink(_queries) {
        return (
            '?' +
            Object.keys(_queries)
                .map((key) => key + '=' + _queries[key])
                .join('&')
        )
    }

    public getPage(_offset: number, _limit: number) {
        return !_offset || _offset === 0 ? 1 : 1 + _offset / _limit
    }

    public getNumberOfPages(_count: number, _limit: number) {
        return Math.ceil(_count / _limit)
    }

    public getPreviousLink(_currentPage: number, _limit: number) {
        if (_currentPage === 1) {
            return null
        }

        return this.generatePageLink(_currentPage - 1, _limit)
    }

    public getNextLink(_currentPage: number, _limit: number, _numberOfPages: number) {
        if (_currentPage === _numberOfPages) {
            return null
        }

        return this.generatePageLink(_currentPage + 1, _limit)
    }

    public changePage(_val: string, _numberOfPages: number, _limit: number) {
        const _valNumber = parseInt(_val)
        let _currentPage = _valNumber

        if (_valNumber < 1) {
            _currentPage = 1
        } else if (_valNumber > _numberOfPages) {
            _currentPage = _numberOfPages
        } else {
            _currentPage = _valNumber
        }

        const _queries = { ...this.$route.query, offset: this.getOffset(_currentPage, _limit) + '' }

        this.$router.push({ path: this.path, query: _queries })
    }
}
