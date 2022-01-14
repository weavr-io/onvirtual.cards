import { Action, Module, Mutation } from 'vuex-module-decorators'
import { StoreModule } from '~/store/storeModule'
import { $api } from '~/utils/api'
import { PaginatedManagedCardsResponse } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/responses/PaginatedManagedCardsResponse'
import { GetManagedCardsRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/requests/GetManagedCardsRequest'
import { ManagedCardModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/models/ManagedCardModel'
import { CreateManagedCardRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/requests/CreateManagedCardRequest'
import { UpdateManagedCardRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/requests/UpdateManagedCardRequest'
import { IDModel } from '~/plugins/weavr-multi/api/models/common/IDModel'
import { StatementFiltersRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/requests/StatementFiltersRequest'
import { StatementResponseModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/responses/StatementResponseModel'
import { ManagedCardStatementRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/requests/ManagedCardStatementRequest'

@Module({
  name: 'cardsModule',
  stateFactory: true,
  namespaced: true
})
export default class Cards extends StoreModule {
  isLoading: boolean = false

  cards: PaginatedManagedCardsResponse | null = null

  managedCard: ManagedCardModel | null = null

  statement: StatementResponseModel | null = null

  filteredStatement: any = {}

  get currency() {
    if (this.cards == null) {
      return null
    } else if (this.cards.cards?.length) {
      return this.cards.cards[0].currency
    } else {
      return null
    }
  }

  get totalAvailableBalance() {
    if (this.cards == null) {
      return 0
    }

    let total = 0

    this.cards.cards?.forEach((card) => {
      if (card.balances?.availableBalance) {
        total += card.balances.availableBalance
      }
    })

    return total
  }

  @Mutation
  SET_FILTERED_STATEMENT() {
    if (this.statement == null) {
      return []
    }

    const _entries = this.statement.entry!.filter((transaction) => {
      const _shouldDisplay = !['AUTHORISATION_REVERSAL', 'AUTHORISATION_EXPIRY', 'AUTHORISATION_DECLINE'].includes(
        transaction.transactionId.type
      )

      if (!_shouldDisplay) {
        return false
      }

      if (transaction.transactionId.type === 'AUTHORISATION') {
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

    this.filteredStatement = _out
  }

  @Mutation
  SET_CARDS(_cards: PaginatedManagedCardsResponse) {
    this.cards = _cards
  }

  @Mutation
  SET_IS_LOADING(_isLoading: boolean) {
    this.isLoading = _isLoading
  }

  @Mutation
  SET_STATEMENT(statement: StatementResponseModel) {
    this.statement = statement
  }

  @Mutation
  RESET_STATEMENT() {
    this.statement = null
  }

  @Mutation
  APPEND_STATEMENT(_statement: StatementResponseModel) {
    if (this.statement === null) {
      this.statement = _statement
    } else {
      _statement.entry!.forEach((_statementEntry) => {
        this.statement?.entry!.push(_statementEntry)
      })
    }
  }

  @Mutation
  SET_MANAGED_CARD(_card: ManagedCardModel) {
    this.managedCard = _card
  }

  @Action({ rawError: true })
  getCards(filters?: GetManagedCardsRequest) {
    const req = this.store.$apiMulti.managedCards.index(filters)

    req.then((res) => {
      this.SET_CARDS(res.data)
    })

    return req
  }

  @Action({ rawError: true })
  addCard(request: CreateManagedCardRequest) {
    const req = this.store.$apiMulti.managedCards.store(request)

    req.finally(() => {
      this.SET_IS_LOADING(false)
    })

    return req
  }

  @Action({ rawError: true })
  update(params: { id: IDModel; request: UpdateManagedCardRequest }) {
    const req = this.store.$apiMulti.managedCards.update(params)

    req.finally(() => {
      this.SET_IS_LOADING(false)
    })

    return req
  }

  @Action({ rawError: true })
  getCardStatement(req: ManagedCardStatementRequest) {
    this.SET_IS_LOADING(true)

    const xhr = this.store.$apiMulti.managedCards.statement(req.id, req.request)

    xhr
      .then((res) => {
        this.SET_STATEMENT(res.data)
        this.SET_FILTERED_STATEMENT()
      })
      .finally(() => {
        this.SET_IS_LOADING(false)
      })

    return xhr
  }

  @Action({ rawError: true })
  getCardStatementPage(request: ManagedCardStatementRequest) {
    const req = $api.post('/app/api/managed_cards/' + request.id + '/statements/get', request.request)

    req.then((res) => {
      this.APPEND_STATEMENT(res.data)
      this.SET_FILTERED_STATEMENT()
    })

    return req
  }

  @Action({ rawError: true })
  getManagedCard(id: string) {
    const req = this.store.$apiMulti.managedCards.show(id)

    req.then((res) => {
      this.SET_MANAGED_CARD(res.data)
    })

    return req
  }

  @Action({ rawError: true })
  freeze(id) {
    this.SET_IS_LOADING(true)

    const req = $api.post('/app/api/managed_cards/' + id + '/freeze', {})

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

    const req = $api.post('/app/api/managed_cards/' + id + '/unfreeze', {})

    req.then((res) => {
      this.SET_MANAGED_CARD(res.data)
    })

    req.finally(() => {
      this.SET_IS_LOADING(false)
    })

    return req
  }

  @Action({ rawError: true })
  remove(id: string) {
    this.SET_IS_LOADING(true)

    const req = this.store.$apiMulti.managedCards.remove(id)

    req.then((res) => {
      this.SET_MANAGED_CARD(res.data)
    })

    req.finally(() => {
      this.SET_IS_LOADING(false)
    })

    return req
  }
}
