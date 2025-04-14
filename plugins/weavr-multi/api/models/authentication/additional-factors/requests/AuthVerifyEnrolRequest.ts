import { z } from 'zod'
import { preprocessEmptyAsUndefined } from '~/utils/zodHelpers'

const AuthVerifyEnrolSchema = z.object({
    verificationCode: preprocessEmptyAsUndefined(z.string().min(6).max(6)),
})

type AuthVerifyEnrol = z.infer<typeof AuthVerifyEnrolSchema>

const INITIAL_AUTH_VERIFY_REQUEST = () => {
    return {
        verificationCode: undefined,
    } as unknown as AuthVerifyEnrol
}
export { AuthVerifyEnrolSchema, type AuthVerifyEnrol, INITIAL_AUTH_VERIFY_REQUEST }
