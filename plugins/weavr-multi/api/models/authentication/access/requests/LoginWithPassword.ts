import { z } from 'zod'
import {
    INITIAL_SENSITIVE_PASSWORD_REQUEST,
    SensitivePasswordSchema,
} from '~/plugins/weavr-multi/api/models/authentication/access/models/SensitivePasswordModel'
import { preprocessEmptyAsUndefined } from '~/utils/zodHelpers' // export interface LoginWithPasswordRequest {

// export interface LoginWithPasswordRequest {
//     email: string
//     password: SensitivePasswordModel
// }

const LoginWithPasswordSchema = z.object({
    email: preprocessEmptyAsUndefined(z.string().email()),
    password: SensitivePasswordSchema.required(),
})

type LoginWithPassword = z.infer<typeof LoginWithPasswordSchema>

const INITIAL_LOGIN_WITH_PASSWORD_REQUEST = {
    email: undefined,
    password: INITIAL_SENSITIVE_PASSWORD_REQUEST,
} as unknown as LoginWithPassword

export { LoginWithPasswordSchema, LoginWithPassword, INITIAL_LOGIN_WITH_PASSWORD_REQUEST }
