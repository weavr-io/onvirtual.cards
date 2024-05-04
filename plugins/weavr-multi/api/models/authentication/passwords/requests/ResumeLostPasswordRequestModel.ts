import { z } from 'zod'
import { preprocessEmptyAsUndefined } from '~/utils/zodHelpers'
import {
    SensitivePasswordModel,
    SensitivePasswordSchema,
    INITIAL_SENSITIVE_PASSWORD_REQUEST,
} from '~/plugins/weavr-multi/api/models/authentication/access/models/SensitivePasswordModel'

export interface ResumeLostPasswordRequestModel {
    nonce: string
    email: string
    newPassword: SensitivePasswordModel
}

const PasswordRequestSchema = z.object({
    nonce: preprocessEmptyAsUndefined(z.string().optional()),
    email: preprocessEmptyAsUndefined(z.string().email()),
    newPassword: SensitivePasswordSchema,
})

type PasswordRequest = z.infer<typeof PasswordRequestSchema>

const INITIAL_PASSWORD_REQUEST = {
    nonce: undefined,
    email: undefined,
    newPassword: INITIAL_SENSITIVE_PASSWORD_REQUEST,
} as unknown as PasswordRequest

export { PasswordRequest, PasswordRequestSchema, INITIAL_PASSWORD_REQUEST }
