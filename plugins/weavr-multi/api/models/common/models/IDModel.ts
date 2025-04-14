import { z } from 'zod'

const IDSchema = z.string()

type IDModel = z.infer<typeof IDSchema>

const INITIAL_ID_REQUEST = undefined as unknown as IDModel

export { IDSchema, type IDModel, INITIAL_ID_REQUEST }
