import type { IDModel } from './models/common/models/IDModel'
import { apiFetch, type ApiResponse } from '~/utils/api'
import type { CreateManagedCard } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/requests/CreateManagedCard'
import type { ManagedCardModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/models/ManagedCardModel'
import type { PaginatedManagedCardsResponse } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/responses/PaginatedManagedCardsResponse'
import type { UpdateManagedCard } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/requests/UpdateManagedCard'
import type { StatementFiltersRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/requests/StatementFiltersRequest'
import type { StatementResponseModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/responses/StatementResponseModel'
import type { ManagedCardsSpendRulesModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/models/ManagedCardsSpendRulesModel'
import type { UpgradeToPhysicalManagedCardRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/requests/UpgradeToPhysicalManagedCardRequest'
import type { ActivatePhysicalManagedCardRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/requests/ActivatePhysicalManagedCardRequest'
import type { PhysicalCardPinResponse } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/responses/PhysicalCardPinResponse'
import type { SetPhysicalCardPinRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/requests/SetPhysicalCardPinRequest'
import type { ReplaceDamagedPhysicalManagedCardRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/requests/ReplaceDamagedPhysicalManagedCardRequest'
import type { ReplaceLostStolenPhysicalManagedCardRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/requests/ReplaceLostStolenPhysicalManagedCardRequest'
import type { GetManagedCardsRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/requests/GetManagedCardsRequest'
import type { GetManagedCardStatementRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/requests/GetManagedCardStatementRequest'

export class ManagedCardsApi {
    index(filters?: GetManagedCardsRequest): Promise<ApiResponse<PaginatedManagedCardsResponse>> {
        return apiFetch.get<PaginatedManagedCardsResponse>('/managed_cards', { query: filters })
    }

    store(request: CreateManagedCard): Promise<ApiResponse<ManagedCardModel>> {
        return apiFetch.post<ManagedCardModel>('/managed_cards', request)
    }

    show(id: IDModel): Promise<ApiResponse<ManagedCardModel>> {
        return apiFetch.get<ManagedCardModel>(`/managed_cards/${id}`)
    }

    update(params: {
        id: IDModel
        request: UpdateManagedCard
    }): Promise<ApiResponse<ManagedCardModel>> {
        return apiFetch.patch<ManagedCardModel>(`/managed_cards/${params.id}`, params.request)
    }

    block(id: IDModel): Promise<ApiResponse<unknown>> {
        return apiFetch.post(`/managed_cards/${id}/block`)
    }

    unblock(id: IDModel): Promise<ApiResponse<unknown>> {
        return apiFetch.post(`/managed_cards/${id}/unblock`)
    }

    remove(id: IDModel): Promise<ApiResponse<unknown>> {
        return apiFetch.post(`/managed_cards/${id}/remove`)
    }

    statement(
        id: IDModel,
        filters?: StatementFiltersRequest,
    ): Promise<ApiResponse<StatementResponseModel>> {
        return apiFetch.get<StatementResponseModel>(`/managed_cards/${id}/statement`, {
            query: filters,
        })
    }

    getSpendRules(id: IDModel): Promise<ApiResponse<ManagedCardsSpendRulesModel>> {
        return apiFetch.get<ManagedCardsSpendRulesModel>(`/managed_cards/${id}/spend_rules`)
    }

    setSpendRules(params: {
        id: IDModel
        body: ManagedCardsSpendRulesModel
    }): Promise<ApiResponse<ManagedCardsSpendRulesModel>> {
        return apiFetch.put<ManagedCardsSpendRulesModel>(
            `/managed_cards/${params.id}/spend_rules`,
            params.body,
        )
    }

    upgradeToPhysicalCard(params: {
        id: IDModel
        body: UpgradeToPhysicalManagedCardRequest
    }): Promise<ApiResponse<ManagedCardModel>> {
        return apiFetch.post<ManagedCardModel>(`/managed_cards/${params.id}/physical`, params.body)
    }

    activatePhysicalCard(
        id: IDModel,
        body: ActivatePhysicalManagedCardRequest,
    ): Promise<ApiResponse<ManagedCardModel>> {
        return apiFetch.post<ManagedCardModel>(`/managed_cards/${id}/physical/activate`, body)
    }

    getPhysicalCardPin(id: IDModel): Promise<ApiResponse<PhysicalCardPinResponse>> {
        return apiFetch.get<PhysicalCardPinResponse>(`/managed_cards/${id}/physical/pin`)
    }

    setPhysicalCardPin(params: {
        id: IDModel
        body: SetPhysicalCardPinRequest
    }): Promise<ApiResponse<PhysicalCardPinResponse>> {
        return apiFetch.post<PhysicalCardPinResponse>(
            `/managed_cards/${params.id}/physical/pin`,
            params.body,
        )
    }

    unblockPhysicalCardPin(id: IDModel): Promise<ApiResponse<unknown>> {
        return apiFetch.patch(`/managed_cards/${id}/physical/pin/unblock`)
    }

    replaceDamagedPhysicalCard(params: {
        id: IDModel
        body: ReplaceDamagedPhysicalManagedCardRequest
    }): Promise<ApiResponse<unknown>> {
        return apiFetch.post(`/managed_cards/${params.id}/physical/replace_damaged`, params.body)
    }

    reportLostPhysicalCard(id: IDModel): Promise<ApiResponse<unknown>> {
        return apiFetch.post(`/managed_cards/${id}/physical/report_lost`)
    }

    reportStolenPhysicalCard(id: IDModel): Promise<ApiResponse<unknown>> {
        return apiFetch.post(`/managed_cards/${id}/physical/report_stolen`)
    }

    replaceLostStolenPhysicalCard(params: {
        id: IDModel
        body: ReplaceLostStolenPhysicalManagedCardRequest
    }): Promise<ApiResponse<ManagedCardModel>> {
        return apiFetch.post<ManagedCardModel>(
            `/managed_cards/${params.id}/physical/replace_lost_stolen`,
            params.body,
        )
    }

    resetPhysicalCardContactlessLimit(id: IDModel): Promise<ApiResponse<unknown>> {
        return apiFetch.post(`/managed_cards/${id}/physical/contactless_limit/reset`)
    }

    downloadStatement(params: { id: IDModel; filters: GetManagedCardStatementRequest }) {
        return apiFetch.get<Blob>(`/managed_cards/${params.id}/statement`, {
            params: params.filters,
            responseType: 'blob',
            headers: {
                Accept: 'text/csv',
            },
        })
    }
}
