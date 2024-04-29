import { INVALID_FEEDBACK_CONST } from '~/models/local/constants/InvalidFeedbackConst'

// TODO: Handle new validation package
export function useValidation() {
    function isInvalid(item) {
        return item.$dirty ? !item.$error : null
    }

    function validateVParams(params: {}, vuelidateSchema: {}): string | null {
        const validatorKeys: string[] = Object.keys(params)
        const validationState: { key: string; value: string }[] = []

        validatorKeys.forEach((key) => {
            if (!vuelidateSchema[key]) {
                validationState.push({ key, value: vuelidateSchema[key] })
            }
        })

        return validationState[0].key.toString() ?? null
    }

    function invalidFeedback(_item, type, customMessage: string) {
        return customMessage ?? INVALID_FEEDBACK_CONST[type] ?? 'Not Handled'
    }

    return { isInvalid, validateVParams, invalidFeedback }
}
