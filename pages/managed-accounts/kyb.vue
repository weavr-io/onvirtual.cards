<template>
  <section>
    <b-container>
      <b-row>
        <b-col>
          <div id="idensic" />
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>
<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import { BIcon, BIconBoxArrowUpRight } from 'bootstrap-vue'
import { VueWithRouter } from '~/base/classes/VueWithRouter'
import * as AuthStore from '~/store/modules/Auth'
import * as CorporatesStore from '~/store/modules/Corporates'

@Component({
  components: {
    BIcon,
    BIconBoxArrowUpRight
  }
})
export default class KybPage extends VueWithRouter {
  accessToken!: string
  corporateId!: string

  async asyncData({ store }) {
    const _corproateid = AuthStore.Helpers.identityId(store)

    try {
      const _res = await CorporatesStore.Helpers.startKYB(store, _corproateid)

      return { accessToken: _res.data.accessToken, corporateId: _corproateid }
    } catch (e) {
      console.log(e)
    }
  }

  mounted() {
    const _config = {
      // provide your clientId (shown in the demo in the top left corner)
      // clientId: 'weavr',

      // access token generated for $YOUR_USER_ID
      // accessToken: '_act-9a26065a-a4fd-4dce-a936-9ed5c17adbfd',

      // your user id for which you generated $ACCESS_TOKEN
      // externalUserId: 'Tamara_Boehm@hotmail.com'

      clientId: 'weavr',
      externalUserId: this.corporateId,
      accessToken: this.accessToken,
      includedCountries: [
        'AUT',
        'BEL',
        'BGR',
        'HRV',
        'CYP',
        'CZE',
        'DNK',
        'EST',
        'FIN',
        'FRA',
        'DEU',
        'GRC',
        'HUN',
        'IRL',
        'ITA',
        'LVA',
        'LTU',
        'LUX',
        'MLT',
        'NLD',
        'POL',
        'PRT',
        'ROU',
        'SVK',
        'SVN',
        'ESP',
        'SWE',
        'GBR'
      ],
      excludedCountries: null,
      navConf: {
        showWarningScreen: false,
        skipWelcomeScreen: true,
        skipReviewScreen: false,
        skipAgreementsScreen: true,
        registration: 'disabled'
      },
      uiConf: {
        customCssStr: "@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam:wght@300;400;500&display=swap');\n\np{ color: #25262B; font-family: 'Be Vietnam', sans-serif;} ul{ column-count: 1; color: #25262B; font-family: 'Be Vietnam', sans-serif; } ul li{ color: #25262B; margin-bottom: 5px; } h4 p, h2, h3.subtitle p{ font-size: 15px; font-weight: 300; margin: 30px 0;} .input-field span, .radio-group span{ text-transform: uppercase; letter-spacing: 0.05em; font-family: 'Be Vietnam', sans-serif; font-weight:500; color: #25262B; } input, select, textarea{ font-family: 'Be Vietnam', sans-serif; padding-bottom: 8px; border-width: 1px; font-size:18px; font-weight: 400; color: #232A47; } input:focus, select:focus, textarea:focus{ border-bottom-color: #D621B2; } input-field{ position:relative;} .input-field span, .radio-group span{ position:absolute; top: 0; height: 20px; } .fields-list.fields-list-two-columns .input-field{ padding-top: 24px; min-height: 40px;} .list li[data-v-044267ea]{ font-family: 'Be Vietnam', sans-serif; color: #25262B; } .flag{ margin-right: 5px;} .upload-item h4{ font-family: 'Be Vietnam', sans-serif; color: #6C1C5C; } .sub-steps .sub-step.active{ color: #3CF7CA; } .sub-steps .sub-step{ width: 12px; height: 12px; } button.submit, button[type=submit]{ background: #3CF7CA; text-transform: lowercase; color: #6C1C5C; font-family: 'Be Vietnam', sans-serif; font-weight: 400; font-size: 15px; letter-spacing: 0;} .mobile-button h3{ font-family: 'Be Vietnam', sans-serif; color: #6C1C5C; font-weight: 500; } .upload-item p{ font-size: 12px; } .mobile-button .fa-icon{ color: #6C1C5C; } .mobile-button h4{ color: #6D7490; font-family: 'Be Vietnam', sans-serif;} button.submit:active:not(:disabled), button.submit:hover:not(:disabled):not(.disabled):not(:active), button[type=submit]:active:not(:disabled), button[type=submit]:hover:not(:disabled):not(.disabled):not(:active){ background: #3CF7CA;} button.submit .arrow, button[type=submit] .arrow{ height: 28px; } .checkbox, .radio-item{ font-family: 'Be Vietnam', sans-serif; color: #232A47; } h4{ font-family: 'Be Vietnam', sans-serif; color: #25262B;} a.payment-method-add{ font-family: 'Be Vietnam', sans-serif; color: #6C1C5C; } a.payment-method-add:hover{ text-decoration: none; } a.payment-method-add .icon{ background: #3CF7CA; width: 38px; height: 38px; } h4.subtitle p{ font-size: 15px; font-weight: 400; color: #6D7490; } h2.uppercase p{ font-weight: 500; } .beneficial-buttons a{ font-family: 'Be Vietnam', sans-serif; color: #6C1C5C; } .error-message .message-content, .error-message .message-title{ font-family: 'Be Vietnam', sans-serif; } .error-message .message-title{ letter-spacing: 0.05em; } .payment-method-data h2{ font-family: 'Be Vietnam', sans-serif; color: #232A47; font-size: 15px; font-weight: 400; } .sub-steps .sub-step.pending{ background: #6C1C5C; }",
        lang: 'en',
        steps: {
          APPLICANT_DATA: {
            customFields: null
          },
          COMPANY: {
            // stepName: "This is the step name",
            title: "Company Verification",
            subTitle: "Step 1: Please fill in details about your business",
            instructions: "Kindly upload the following documents\n* Copy of  the Certificate of Incorporation\n* Copy of the Articles of Association (last amendment)\n* Proof of Business Address such as a copy of a bank statement or lease agreement in the name of the business",
            subTitleUbo:
                    'Step 2: Please name the individuals who are considered to be ultimate beneficial owners and own at least 25% of the company',
            instructionsUbo:
                    'After submitting the form all the individuals will be followed up via emails with a request to go through a standard KYC/AML procedure.',
            subTitleRepresentative: 
                    "Step 3: Please name representatives of the company",
            instructionsRepresentative: 
                    "You can add several individuals with representative powers. Please fill out the following information.",
            individualBeneficiaryFields: {
              ubo: [
                {
                  name: 'firstName',
                  required: true
                },
                {
                  name: 'lastName',
                  required: true
                },
                {
                  name: 'middleName',
                  required: false
                },
                {
                  name: 'dob',
                  required: true
                },
                {
                  name: 'nationality',
                  required: true
                }
              ],
              representative: [
                {
                  name: 'firstName',
                  required: true
                },
                {
                  name: 'lastName',
                  required: true
                },
                {
                  name: 'middleName',
                  required: false
                },
                {
                  name: 'dob',
                  required: true
                },
                {
                  name: 'email',
                  required: true
                },
                {
                  name: 'buildingNumber',
                  required: true
                },
                {
                  name: 'flatNumber',
                  required: true
                },
                {
                  name: 'street',
                  required: true
                },
                {
                  name: 'town',
                  required: true
                },
                {
                  name: 'state',
                  required: false
                },
                {
                  name: 'postCode',
                  required: true
                },
                {
                  name: 'country',
                  required: true
                }
              ]
            },
            companyBeneficiaryFields: [
              {
                name: 'companyName',
                required: true
              },
              {
                name: 'registrationNumber',
                required: true
              },
              {
                name: 'country',
                required: true
              },
              {
                name: 'legalAddress',
                required: true
              },
              {
                name: 'email',
                required: true
              },
              {
                name: 'phone',
                required: true
              },
              {
                name: 'incorporatedOn',
                required: true
              }
            ],
            skipEmailsToIndividuals: {
              ubo: true,
              shareholder: true,
              representative: false
            },
            generateIndividualsWebsdkUrls: false,
            individualsWebsdkUrlsLivetime: 1800,
            requireUBOsBeneficiaries: true,
            beneficiaryRequiredIdDocs: {
              docSets: [
                {
                  idDocSetType: 'IDENTITY',
                  types: ['ID_CARD', 'PASSPORT', 'DRIVERS', 'RESIDENCE_PERMIT'],
                  fields: null
                },
                {
                  idDocSetType: 'SELFIE',
                  types: ['SELFIE'],
                  videoRequired: 'disabled',
                  fields: null
                }
              ]
            }
          },
          REVIEW: {
            instructions: "Step Review: Instructions"
          },
          STATUS: {
            pending: {
              title: "We are reviewing your documents. This process usually takes up to 3 business days.",
              instructions: "Your documents are under review. The status of your account will change automatically once the review is completed. If you experience any difficulties, please contact customer support."
            }
          },
          APPLICANT_REQUEST: {
            title: 'Start Verification for your business',
            button: 'Upload Documents'
          }
        }
      },
      documentsByCountries: {}
    }

    // @ts-ignore
    window.idensic.init(
      // selector of the WebSDK container (see above)
      '#idensic',
      // configuration object (see the settings in the demo)
      _config,
      // function for the WebSDK callbacks
      function(messageType, payload) {
        // e.g. just logging the incoming messages
        console.log('[IDENSIC DEMO] Idensic message:', messageType, payload)
      }
    )
  }
}
</script>
<style lang="scss" scoped>
ol {
  margin: 0;
  padding: 0;
  list-style-position: inside;

  li {
    margin: 0;
    padding: 16px 0;
    border-top: 1px solid #eaedf6;

    &:last-child {
      border-bottom: 1px solid #eaedf6;
    }
  }
}
</style>
