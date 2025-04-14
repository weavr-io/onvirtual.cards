import { z } from 'zod'
import { preprocessEmptyAsUndefined } from '~/utils/zodHelpers'
import { InstrumentEnum } from '~/plugins/weavr-multi/api/models/common/enums/InstrumentEnum'
import { INVALID_FEEDBACK_CONST } from '~/local/const/InvalidFeedbackConst'

const InstrumentIDSchema = z.object({
    type: z.nativeEnum(InstrumentEnum),
    id: preprocessEmptyAsUndefined(z.string().min(1, { message: INVALID_FEEDBACK_CONST.required })),
})

type InstrumentID = z.infer<typeof InstrumentIDSchema>

const INITIAL_INSTRUMENT_ID = () => {
    return {
        type: InstrumentEnum.managedAccounts,
        id: undefined,
    } as unknown as InstrumentID
}
export { type InstrumentID, InstrumentIDSchema, INITIAL_INSTRUMENT_ID }
