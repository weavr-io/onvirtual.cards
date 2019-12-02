import { ActionTree, ActionContext } from 'vuex'
import { ManagedCardsSchemas } from '~/api/ManagedCardsSchemas'

export const types = {
  SET_IS_LOADING: 'SET_IS_LOADING',
  SET_CARDS: 'SET_CARDS',
  SET_MANAGED_CARD: 'SET_MANAGED_CARD',
  SET_STATEMENT: 'SET_STATEMENT'
}

export interface State {
  isLoading: boolean
  cards: ManagedCardsSchemas.ManagedCard[]
  managedCard: ManagedCardsSchemas.ManagedCard | null
  statement: ManagedCardsSchemas.ManagedCardStatement | null
}

export interface Actions<S, R> extends ActionTree<S, R> {
  getCards(context: ActionContext<S, R>)
  addCard(
    context: ActionContext<S, R>,
    request: ManagedCardsSchemas.CreateManagedCardRequest
  )
  getManagedCard(context: ActionContext<S, R>, id: number): Promise<R>
  destroyManagedCard(
    context: ActionContext<S, R>,
    request: ManagedCardsSchemas.DestroyRequest
  ): Promise<R>
  getCardStatement(
    context: ActionContext<S, R>,
    request: ManagedCardsSchemas.GetManagedCardStatementRequest
  ): Promise<R>
}
