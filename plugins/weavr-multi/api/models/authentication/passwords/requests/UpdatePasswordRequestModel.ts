import { z } from 'zod'
import {
    INITIAL_SENSITIVE_PASSWORD_REQUEST,
    SensitivePasswordSchema,
} from '~/plugins/weavr-multi/api/models/authentication/access/models/SensitivePasswordModel'

const UpdatePasswordRequestSchema = z.object({
    oldPassword: SensitivePasswordSchema,
    newPassword: SensitivePasswordSchema,
})

type UpdatePasswordRequestModel = z.infer<typeof UpdatePasswordRequestSchema>

const INITIAL_UPDATE_PASSWORD_REQUEST = () => {
    return {
        oldPassword: INITIAL_SENSITIVE_PASSWORD_REQUEST(),
        newPassword: INITIAL_SENSITIVE_PASSWORD_REQUEST(),
    } as unknown as UpdatePasswordRequestModel
}

export { UpdatePasswordRequestModel, UpdatePasswordRequestSchema, INITIAL_UPDATE_PASSWORD_REQUEST }
