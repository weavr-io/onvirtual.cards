import { z } from 'zod'
import { preprocessEmptyAsUndefined } from '~/utils/zodHelpers'

const VerifyEmailSchema = z.object({
    email: preprocessEmptyAsUndefined(z.string().email()),
    verificationCode: preprocessEmptyAsUndefined(z.string().min(6).max(6)),
})

type VerifyEmail = z.infer<typeof VerifyEmailSchema>

const INITIAL_VERIFY_EMAIL_REQUEST = () => {
    return {
        email: undefined,
        verificationCode: undefined,
    } as unknown as VerifyEmail
}

export { VerifyEmailSchema, type VerifyEmail, INITIAL_VERIFY_EMAIL_REQUEST }
