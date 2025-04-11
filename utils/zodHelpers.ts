import { z, type ZodTypeAny } from 'zod'

function preprocessEmptyAsUndefined(schema: ZodTypeAny) {
    return z.preprocess(emptyAsUndefined, schema)
}

// Define your preprocess function
const emptyAsUndefined = (val) => (val === '' ? undefined : val)

export { emptyAsUndefined, preprocessEmptyAsUndefined }
