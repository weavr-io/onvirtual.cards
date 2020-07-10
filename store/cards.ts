import { Module, Action, Mutation } from 'vuex-module-decorators'
import { api } from '~/api/Axios'
import { ManagedCardsSchemas } from '~/api/ManagedCardsSchemas'
import { Statement } from '~/api/Models/Statements/Statement'
import { StoreModule } from '~/store/storeModule'
import { ManagedCardsFilter } from '~/api/Requests/ManagedCards/ManagedCardsFilter'

@Module({
  name: 'cardsV2',
  stateFactory: true,
  namespaced: true
})
export default class Cards extends StoreModule {
  isLoading: boolean = false

  cards: ManagedCardsSchemas.ManagedCard[] = []

  managedCard: ManagedCardsSchemas.ManagedCard | null = null

  statement: Statement | null = null

  get currency() {
    if (this.cards == null) {
      return null
    } else if (this.cards.length > 0) {
      return this.cards[0].currency
    } else {
      return null
    }
  }

  get totalAvailableBalance() {
    if (this.cards == null) {
      return 0
    }

    let total = 0

    this.cards.forEach((card: ManagedCardsSchemas.ManagedCard) => {
      if (card.balances.availableBalance) {
        total += parseInt(card.balances.availableBalance)
      }
    })

    return total
  }

  get filteredStatement() {
    if (this.statement == null) {
      return []
    }

    const _entries = this.statement.entry.filter((transaction) => {
      const _shouldDisplay = !['AUTHORISATION_REVERSAL', 'AUTHORISATION_EXPIRY', 'AUTHORISATION_DECLINE'].includes(
        transaction.txId.type
      )

      if (!_shouldDisplay) {
        return false
      }

      if (transaction.txId.type === 'AUTHORISATION') {
        if (transaction.additionalFields?.authorisationState === 'COMPLETED') {
          return false
        }
      }

      return true
    })

    const _out = {}

    _entries.forEach((_entry) => {
      if (_entry.processedTimestamp) {
        const _processedTimestamp = parseInt(_entry.processedTimestamp)
        // @ts-ignore
        const _date = window.$nuxt.$moment(_processedTimestamp).startOf('day')

        if (!_out[_date]) {
          _out[_date] = []
        }

        _out[_date].push(_entry)
      }
    })

    return _out
  }

  @Mutation
  SET_CARDS(_cards: ManagedCardsSchemas.ManagedCard[]) {
    this.cards = _cards
  }

  @Mutation
  SET_IS_LOADING(_isLoading: boolean) {
    this.isLoading = _isLoading
  }

  @Mutation
  SET_STATEMENT(_statement: Statement) {
    this.statement = _statement
  }

  @Mutation
  SET_MANAGED_CARD(_card: ManagedCardsSchemas.ManagedCard) {
    this.managedCard = _card
  }

  @Action({ rawError: true })
  getCards(filters: ManagedCardsFilter) {
    const req = api.post('/app/api/managed_cards/get', filters)

    req.then((res) => {
      this.SET_CARDS(res.data.card)
    })

    return req
  }

  @Action({ rawError: true })
  addCard(request: ManagedCardsSchemas.CreateManagedCardRequest) {
    const req = api.post('/app/api/managed_cards/_/create', request)

    req.finally(() => {
      this.SET_IS_LOADING(false)
    })

    return req
  }

  @Action({ rawError: true })
  update(request) {
    const req = api.post('/app/api/managed_cards/' + request.id + '/update', request.body)

    req.finally(() => {
      this.SET_IS_LOADING(false)
    })

    return req
  }

  @Action({ rawError: true })
  getCardStatement(request) {
    this.SET_IS_LOADING(true)

    const req = api.post('/app/api/managed_cards/' + request.id + '/statement/get', request)

    req.then((res) => {
      this.SET_STATEMENT(res.data)
    })

    req.finally(() => {
      this.SET_IS_LOADING(false)
    })

    return req
  }

  @Action({ rawError: true })
  getManagedCard(id) {
    const req = api.post('/app/api/managed_cards/' + id + '/get', {})

    req.then((res) => {
      this.SET_MANAGED_CARD(res.data)
    })

    return req
  }

  @Action({ rawError: true })
  freeze(id) {
    this.SET_IS_LOADING(true)

    const req = api.post('/app/api/managed_cards/' + id + '/freeze', {})

    req.then((res) => {
      this.SET_MANAGED_CARD(res.data)
    })

    req.finally(() => {
      this.SET_IS_LOADING(false)
    })

    return req
  }

  @Action({ rawError: true })
  unfreeze(id) {
    this.SET_IS_LOADING(true)

    const req = api.post('/app/api/managed_cards/' + id + '/unfreeze', {})

    req.then((res) => {
      this.SET_MANAGED_CARD(res.data)
    })

    req.finally(() => {
      this.SET_IS_LOADING(false)
    })

    return req
  }

  @Action({ rawError: true })
  remove(id) {
    this.SET_IS_LOADING(true)

    const req = api.post('/app/api/managed_cards/' + id + '/remove', {})

    req.then((res) => {
      this.SET_MANAGED_CARD(res.data)
    })

    req.finally(() => {
      this.SET_IS_LOADING(false)
    })

    return req
  }
}
