import { z } from 'zod'
import {
    INITIAL_SENSITIVE_PASSWORD_REQUEST,
    SensitivePasswordSchema,
} from '~/plugins/weavr-multi/api/models/authentication/access/models/SensitivePasswordModel'
import { preprocessEmptyAsUndefined } from '~/utils/zodHelpers'

const LoginWithPasswordSchema = z.object({
    email: preprocessEmptyAsUndefined(z.string().email()),
    password: SensitivePasswordSchema.required(),
})

type LoginWithPassword = z.infer<typeof LoginWithPasswordSchema>

const PasswordSchema = LoginWithPasswordSchema.pick({ password: true })
type Password = z.infer<typeof PasswordSchema>

const INITIAL_PASSWORD_REQUEST = () => {
    return {
        password: { ...INITIAL_SENSITIVE_PASSWORD_REQUEST() },
    } as unknown as Password
}

const INITIAL_LOGIN_WITH_PASSWORD_REQUEST = () => {
    return {
        email: undefined,
        ...INITIAL_PASSWORD_REQUEST(),
    } as unknown as LoginWithPassword
}

export {
    LoginWithPasswordSchema,
    Password,
    PasswordSchema,
    LoginWithPassword,
    INITIAL_PASSWORD_REQUEST,
    INITIAL_LOGIN_WITH_PASSWORD_REQUEST,
}
