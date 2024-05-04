import { z } from 'zod'
import { preprocessEmptyAsUndefined } from '~/utils/zodHelpers'

export interface InitiateLostPasswordRequestModel {
    email: string
}

const ResetSchema = z.object({
    email: preprocessEmptyAsUndefined(z.string().email()),
})

type ResetRequest = z.infer<typeof ResetSchema>

const INITIAL_RESET_REQUEST = {
    email: undefined,
} as unknown as ResetRequest

export { ResetRequest, ResetSchema, INITIAL_RESET_REQUEST }
