import { SendEmailRequest } from '~/api/Requests/SendEmailRequest'

export interface SendVerificationEmailRequest {
  body: SendEmailRequest
  corporateId: string
}
