import { Component, Vue } from 'nuxt-property-decorator'
import { INVALID_FEEDBACK_CONST } from '~/models/local/constants/InvalidFeedbackConst'

@Component
export default class ValidationMixin extends Vue {
  public isInvalid(item) {
    return item.$dirty ? !item.$error : null
  }

  // Usage example with InvalidFeedBack Method
  // invalidFeedback($v.formDetails.emailSender,validateVParams($v.formDetails.emailSender.$params, $v.formDetails.emailSender))
  public validateVParams(params: {}, vuelidateSchema: {}): string | null {
    const validatorKeys: string[] = Object.keys(params)
    const validationState: { key: string; value: string }[] = []

    validatorKeys.forEach((key) => {
      if (!vuelidateSchema[key]) {
        validationState.push({ key, value: vuelidateSchema[key] })
      }
    })

    if (validationState.length > 0) {
      return validationState[0].key.toString()
    } else {
      return null
    }
  }

  public invalidFeedback(_item, type, customMessage) {
    const messageResult: string | undefined = customMessage ?? INVALID_FEEDBACK_CONST[type]

    return messageResult ?? 'Not Handled'
  }
}
