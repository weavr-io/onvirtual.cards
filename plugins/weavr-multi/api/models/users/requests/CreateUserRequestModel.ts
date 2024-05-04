import { z } from 'zod'
import { preprocessEmptyAsUndefined } from '~/utils/zodHelpers'
import { MobileModel } from '~/plugins/weavr-multi/api/models/common/models/MobileModel'
import { DateModel } from '~/plugins/weavr-multi/api/models/common/DateModel'
import { INVALID_FEEDBACK_CONST } from '~/local/const/InvalidFeedbackConst'

export interface CreateUserRequestModel {
    name: string
    surname: string
    email: string
    mobile?: MobileModel
    dateOfBirth?: DateModel
}

const UserSchema = z.object({
    name: preprocessEmptyAsUndefined(
        z.string().min(1).max(100, { message: INVALID_FEEDBACK_CONST.maxLength100 }),
    ),
    surname: preprocessEmptyAsUndefined(
        z.string().min(1).max(100, { message: INVALID_FEEDBACK_CONST.maxLength100 }),
    ),
    email: preprocessEmptyAsUndefined(z.string().email()),
    mobile: preprocessEmptyAsUndefined(z.string().optional()),
    dateOfBirth: preprocessEmptyAsUndefined(z.string().optional()),
})

type UserRequest = z.infer<typeof UserSchema>

const INITIAL_USER_REQUEST = {
    name: undefined,
    surname: undefined,
    email: undefined,
    mobile: undefined,
    dateOfBirth: undefined,
} as unknown as UserRequest

export { UserRequest, UserSchema, INITIAL_USER_REQUEST }
