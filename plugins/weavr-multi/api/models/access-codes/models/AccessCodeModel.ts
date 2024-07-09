import { z } from 'zod'
import { preprocessEmptyAsUndefined } from '~/utils/zodHelpers'

const AccessCodeSchema = z.object({
    code: preprocessEmptyAsUndefined(z.number().min(1)),
})

type AccessCode = z.infer<typeof AccessCodeSchema>

const INITIAL_ACCESS_CODE_REQUEST = () => {
    return {
        code: undefined,
    } as unknown as AccessCode
}

export { type AccessCode, AccessCodeSchema, INITIAL_ACCESS_CODE_REQUEST }
