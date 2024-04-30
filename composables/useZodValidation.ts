import { z, type ZodTypeAny } from 'zod'
import { get, groupBy } from 'lodash-es'
import { Ref, unref, watch } from '@nuxtjs/composition-api'
import { computed, ref } from 'vue'

type MaybeRefOrGetter<T> = T | Ref<T> | (() => T)

function toValue<T>(r: MaybeRefOrGetter<T>): T {
    return typeof r === 'function' ? (r as any)() : unref(r)
}

export default function <T extends ZodTypeAny>(
    schema: T,
    data: MaybeRefOrGetter<Record<string, unknown>>,
    options?: { mode: 'eager' | 'lazy' },
) {
    const opts = Object.assign({}, { mode: 'lazy' }, options)

    const isValid = ref(true)

    let unwatch: null | (() => void) = null

    const errors = ref<Record<string, z.ZodIssue[]> | null>(null)

    const clearErrors = () => {
        errors.value = null
    }

    const isInvalid = computed(() => !isValid.value)

    const validationWatch = () => {
        if (unwatch !== null) {
            return
        }

        unwatch = watch(
            () => toValue(data),
            async () => {
                await validate()
            },
            { deep: true },
        )
    }

    const validate = async () => {
        clearErrors()

        const result = await schema.safeParseAsync(toValue(data))

        isValid.value = result.success

        if (!result.success) {
            errors.value = groupBy(result.error.issues, 'path')
            validationWatch()
        }

        return errors
    }

    const scrollToError = (selector = '.is-error', options = { offset: 0 }) => {
        const element = document.querySelector(selector)

        if (element) {
            const topOffset =
                element.getBoundingClientRect().top -
                document.body.getBoundingClientRect().top -
                options.offset

            window.scrollTo({
                behavior: 'smooth',
                top: topOffset,
            })
        }
    }

    const getInvalidFeedback = (path: string) =>
        get(errors.value, `${path.replaceAll('.', ',')}.0.message`)

    /**
     * @return Returns null | false. If there is an error associated with the key it will return false [Invalid].
     * Otherwise, it will only return null. We are returning null so that we don't mark the input as truthy [Valid].
     * We can also alter this to return a truthy in the future if necessary. But at the time being we don't need truthy values.
     * @param path
     */
    const getState = (path: string) => {
        // Return null if there is no error for specified path
        if (!errors?.value) return null

        // Return falsey state if there is an error
        if (errors.value[path]) {
            return false
        }
    }

    if (opts.mode === 'eager') {
        validationWatch()
    }

    return {
        validate,
        errors,
        isValid,
        isInvalid,
        clearErrors,
        getInvalidFeedback,
        getState,
        scrollToError,
    }
}
