import { GetterTree, ActionContext, ActionTree, MutationTree } from 'vuex'
import { RootState } from 'store'

export const types = {}

export interface State {}

export const state = (): State => ({})

export const getters: GetterTree<State, RootState> = {}

export interface Actions<S, R> extends ActionTree<S, R> {
  nuxtServerInit(context: ActionContext<S, R>): void
}

export const actions: Actions<State, RootState> = {
  async nuxtServerInit() {}
}

export const mutations: MutationTree<State> = {}
