import { z } from 'zod'
import { INVALID_FEEDBACK_CONST } from '~/local/const/InvalidFeedbackConst'

const AmountSchema = (maxValue: number) =>
    z
        .number()
        .min(0.01, { message: INVALID_FEEDBACK_CONST.minBalance })
        .max(maxValue, { message: INVALID_FEEDBACK_CONST.maxBalance })

const CurrencyAmountSchema = (maxValue: number) =>
    z.object({
        currency: z.string(),
        amount: AmountSchema(maxValue),
    })

type CurrencyAmount = z.infer<ReturnType<typeof CurrencyAmountSchema>>
type Amount = z.infer<ReturnType<typeof AmountSchema>>

export { CurrencyAmount, Amount, CurrencyAmountSchema, AmountSchema }
