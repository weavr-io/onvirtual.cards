import { z } from 'zod'
import { preprocessEmptyAsUndefined } from '~/utils/zodHelpers'
import {
    INITIAL_SENSITIVE_PASSWORD_REQUEST,
    SensitivePasswordSchema,
} from '~/plugins/weavr-multi/api/models/authentication/access/models/SensitivePasswordModel'

const ResumeLostPasswordSchema = z.object({
    nonce: preprocessEmptyAsUndefined(z.string().optional()),
    email: preprocessEmptyAsUndefined(z.string().email()),
    newPassword: SensitivePasswordSchema,
})

type ResumeLostPassword = z.infer<typeof ResumeLostPasswordSchema>

const INITIAL_RESUME_LOST_PASSWORD_REQUEST = () => {
    return {
        nonce: undefined,
        email: undefined,
        newPassword: {
            ...INITIAL_SENSITIVE_PASSWORD_REQUEST(),
        },
    } as unknown as ResumeLostPassword
}

export { ResumeLostPassword, ResumeLostPasswordSchema, INITIAL_RESUME_LOST_PASSWORD_REQUEST }
