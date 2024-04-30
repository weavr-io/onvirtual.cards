import { z } from 'zod'
import { preprocessEmptyAsUndefined } from '~/utils/zodHelpers'

export interface SensitivePasswordModel {
    value?: string
}

const SensitivePasswordSchema = z.object({
    value: preprocessEmptyAsUndefined(z.string()),
})

type SensitivePassword = z.infer<typeof SensitivePasswordSchema>

const INITIAL_SENSITIVE_PASSWORD_REQUEST = {
    value: undefined,
} as unknown as SensitivePassword

export { SensitivePassword, SensitivePasswordSchema, INITIAL_SENSITIVE_PASSWORD_REQUEST }
