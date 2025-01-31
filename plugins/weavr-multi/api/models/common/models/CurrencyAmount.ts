import { z } from 'zod'
import { INVALID_FEEDBACK_CONST } from '~/local/const/InvalidFeedbackConst'
import { preprocessEmptyAsUndefined } from '~/utils/zodHelpers'

const AmountWithMaxSchema = (maxValue: number) =>
    z
        .number()
        .min(0.01, { message: INVALID_FEEDBACK_CONST.minBalance })
        .max(maxValue, { message: INVALID_FEEDBACK_CONST.maxBalance })

const CurrencyAmountSchema = (maxValue: number) =>
    z.object({
        currency: preprocessEmptyAsUndefined(z.string()),
        amount: preprocessEmptyAsUndefined(AmountWithMaxSchema(maxValue)),
    })

type CurrencyAmount = z.infer<ReturnType<typeof CurrencyAmountSchema>>
type Amount = z.infer<ReturnType<typeof AmountWithMaxSchema>>

export { CurrencyAmount, Amount, CurrencyAmountSchema, AmountWithMaxSchema }
