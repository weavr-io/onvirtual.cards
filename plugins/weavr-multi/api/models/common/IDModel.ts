import { z } from 'zod'

export type IDModel = string

const IDSchema = z.string()

type ID = z.infer<typeof IDSchema>

const INITIAL_ID_REQUEST = undefined as unknown as ID

export { IDSchema, ID, INITIAL_ID_REQUEST }
