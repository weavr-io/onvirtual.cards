import type { AxiosResponse } from 'axios'
import type { IDModel } from './models/common/IDModel'
import { $axiosMulti } from '~/utils/api'
import type { CreateManagedCardRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/requests/CreateManagedCardRequest'
import type { ManagedCardModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/models/ManagedCardModel'
import type { PaginatedManagedCardsResponse } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/responses/PaginatedManagedCardsResponse'
import type { UpdateManagedCardRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/requests/UpdateManagedCardRequest'
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
    index(filters?: GetManagedCardsRequest): Promise<AxiosResponse<PaginatedManagedCardsResponse>> {
        return $axiosMulti.get<PaginatedManagedCardsResponse>('/managed_cards', { params: filters })
    }

    store(request: CreateManagedCardRequest): Promise<AxiosResponse<ManagedCardModel>> {
        return $axiosMulti.post<ManagedCardModel>('/managed_cards', request)
    }

    show(id: IDModel): Promise<AxiosResponse<ManagedCardModel>> {
        return $axiosMulti.get<ManagedCardModel>(`/managed_cards/${id}`)
    }

    update(params: {
        id: IDModel
        request: UpdateManagedCardRequest
    }): Promise<AxiosResponse<ManagedCardModel>> {
        return $axiosMulti.patch<ManagedCardModel>(`/managed_cards/${params.id}`, params.request)
    }

    block(id: IDModel): Promise<AxiosResponse> {
        return $axiosMulti.post(`/managed_cards/${id}/block`)
    }

    unblock(id: IDModel): Promise<AxiosResponse> {
        return $axiosMulti.post(`/managed_cards/${id}/unblock`)
    }

    remove(id: IDModel): Promise<AxiosResponse> {
        return $axiosMulti.post(`/managed_cards/${id}/remove`)
    }

    statement(
        id: IDModel,
        filters?: StatementFiltersRequest,
    ): Promise<AxiosResponse<StatementResponseModel>> {
        return $axiosMulti.get<StatementResponseModel>(`/managed_cards/${id}/statement`, {
            params: filters,
        })
    }

    getSpendRules(id: IDModel): Promise<AxiosResponse<ManagedCardsSpendRulesModel>> {
        return $axiosMulti.get<ManagedCardsSpendRulesModel>(`/managed_cards/${id}/spend_rules`)
    }

    setSpendRules(params: {
        id: IDModel
        body: ManagedCardsSpendRulesModel
    }): Promise<AxiosResponse<ManagedCardsSpendRulesModel>> {
        return $axiosMulti.put<ManagedCardsSpendRulesModel>(
            `/managed_cards/${params.id}/spend_rules`,
            params.body,
        )
    }

    upgradeToPhysicalCard(params: {
        id: IDModel
        body: UpgradeToPhysicalManagedCardRequest
    }): Promise<AxiosResponse<ManagedCardModel>> {
        return $axiosMulti.post<ManagedCardModel>(
            `/managed_cards/${params.id}/physical`,
            params.body,
        )
    }

    activatePhysicalCard(
        id: IDModel,
        body: ActivatePhysicalManagedCardRequest,
    ): Promise<AxiosResponse<ManagedCardModel>> {
        return $axiosMulti.post<ManagedCardModel>(`/managed_cards/${id}/physical/activate`, body)
    }

    getPhysicalCardPin(id: IDModel): Promise<AxiosResponse<PhysicalCardPinResponse>> {
        return $axiosMulti.get<PhysicalCardPinResponse>(`/managed_cards/${id}/physical/pin`)
    }

    setPhysicalCardPin(params: {
        id: IDModel
        body: SetPhysicalCardPinRequest
    }): Promise<AxiosResponse<PhysicalCardPinResponse>> {
        return $axiosMulti.post<PhysicalCardPinResponse>(
            `/managed_cards/${params.id}/physical/pin`,
            params.body,
        )
    }

    unblockPhysicalCardPin(id: IDModel): Promise<AxiosResponse> {
        return $axiosMulti.patch(`/managed_cards/${id}/physical/pin/unblock`)
    }

    replaceDamagedPhysicalCard(params: {
        id: IDModel
        body: ReplaceDamagedPhysicalManagedCardRequest
    }): Promise<AxiosResponse> {
        return $axiosMulti.post(`/managed_cards/${params.id}/physical/replace_damaged`, params.body)
    }

    reportLostPhysicalCard(id: IDModel): Promise<AxiosResponse> {
        return $axiosMulti.post(`/managed_cards/${id}/physical/report_lost`)
    }

    reportStolenPhysicalCard(id: IDModel): Promise<AxiosResponse> {
        return $axiosMulti.post(`/managed_cards/${id}/physical/report_stolen`)
    }

    replaceLostStolenPhysicalCard(params: {
        id: IDModel
        body: ReplaceLostStolenPhysicalManagedCardRequest
    }): Promise<AxiosResponse<ManagedCardModel>> {
        return $axiosMulti.post<ManagedCardModel>(
            `/managed_cards/${params.id}/physical/replace_lost_stolen`,
            params.body,
        )
    }

    resetPhysicalCardContactlessLimit(id: IDModel): Promise<AxiosResponse> {
        return $axiosMulti.post(`/managed_cards/${id}/physical/contactless_limit/reset`)
    }

    downloadStatement(params: { id: IDModel; filters: GetManagedCardStatementRequest }) {
        return $axiosMulti.get<Blob>(`/managed_cards/${params.id}/statement`, {
            params: params.filters,
            responseType: 'blob',
            headers: {
                Accept: 'text/csv',
            },
        })
    }
}
