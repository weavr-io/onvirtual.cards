import { z } from 'zod'
import { preprocessEmptyAsUndefined } from '~/utils/zodHelpers'
import { InstrumentEnum } from '~/plugins/weavr-multi/api/models/common/enums/InstrumentEnum'
import { INVALID_FEEDBACK_CONST } from '~/local/const/InvalidFeedbackConst'

export interface InstrumentIdModel {
    type: InstrumentEnum
    id: string
}

const InstrumentSchema = z.object({
    type: z.nativeEnum(InstrumentEnum),
    id: preprocessEmptyAsUndefined(z.string().min(1, INVALID_FEEDBACK_CONST.required)),
})

type Instrument = z.infer<typeof InstrumentSchema>

const INITIAL_INSTRUMENT_REQUEST = {
    type: InstrumentEnum.managedAccounts,
    id: undefined,
} as unknown as Instrument

export { Instrument, InstrumentSchema, INITIAL_INSTRUMENT_REQUEST }
