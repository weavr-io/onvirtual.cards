import {
    INITIAL_SENSITIVE_PASSWORD_REQUEST,
    SensitivePasswordModel,
} from '~/plugins/weavr-multi/api/models/authentication/access/models/SensitivePasswordModel'

export interface InviteConsumeRequestModel {
    inviteCode: string
    password?: SensitivePasswordModel
}

export const INITIAL_INVITE_CONSUME_REQUEST = () => {
    return {
        inviteCode: undefined,
        password: INITIAL_SENSITIVE_PASSWORD_REQUEST(),
    } as unknown as InviteConsumeRequestModel
}
