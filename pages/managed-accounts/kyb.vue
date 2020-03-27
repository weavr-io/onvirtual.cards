<template>
  <section>
    <b-container>
      <b-row>
        <b-col md="6" offset-md="3" class="py-5 font-weight-lighter">
          <h3 class="text-center font-weight-lighter mb-4">
            We need some documents
          </h3>
          <p>
            Please send us the following documents in PDF to
            <a href="mailto:kyb@weavr.io" class="link font-weight-normal">kyb@weavr.io</a>
          </p>
          <p>
            Each document must be signed by your CEO. For 1-3 include the wording “Certified true copy of the original”
            above the CEO’s signature.
          </p>

          <ol class="my-5 font-weight-normal">
            <li>Copy of the Certificate of Incorporation</li>
            <li>Copy of the Articles of Association last amendment</li>
            <li>
              Proof of Business Address such as a copy of a bank statement or lease agreement in the name of the
              business
            </li>
            <li>List of Directors: name, date of birth, address, copy of ID document</li>
            <li>
              List of Ultimate Beneficiary Owners (UBOs) holding a stake of 10% or more of the equity: name, date of
              birth, address, nationality
            </li>
            <li>
              <a href="/ubo-declaration.docx" target="_blank" class="link"
                >UBO declaration form
                <b-icon icon="box-arrow-up-right"
/>
              </a>
            </li>
          </ol>
          <div class="text-center">
            <b-button to="/">
              ok, take me to dashboard
            </b-button>
          </div>
        </b-col>
      </b-row>
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
  async asyncData({ store, redirect }) {
    const _corproateid = AuthStore.Helpers.identityId(store)

    try {
      const _res = await CorporatesStore.Helpers.startKYB(store, _corproateid)
      debugger
      return { redirectUrl: _res.data.redirectUrl }
    } catch (e) {
      console.log(e)
    }
  }

  mounted() {
    super.mounted()
    // eslint-disable-next-line
    const id = idensic.init(
      // selector of the WebSDK container (see above)
      '#idensic',
      // configuration object (see the settings in the demo)
      {
        // provide your clientId (shown in the demo in the top left corner)
        // clientId: 'weavr',

        // access token generated for $YOUR_USER_ID
        // accessToken: '_act-9a26065a-a4fd-4dce-a936-9ed5c17adbfd',

        // your user id for which you generated $ACCESS_TOKEN
        // externalUserId: 'Tamara_Boehm@hotmail.com'

        clientId: 'weavr',
        externalUserId: 'Rae_Abbott18@gmail.com',
        accessToken: '_act-a7988071-36fa-48af-9612-e62b934beefc',
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
          skipWelcomeScreen: false,
          skipReviewScreen: false,
          skipAgreementsScreen: false,
          registration: 'disabled'
        },
        uiConf: {
          lang: 'en',
          steps: {
            CREATE_APPLICANT: {
              title: 'Please, follow the steps after agreeing to our conditions.',
              instructions:
                'To get your business account verified please prepare your company documents – Certificate of Incorporation, Articles of Association, List of Directors and UBOs. ',
              agreements: [
                'I agree to the processing of my company data in accordance with [Consent to Data Processing]() '
              ]
            },
            APPLICANT_DATA: {
              customFields: null
            },
            COMPANY: {
              subTitleUbo:
                'Please name the individuals who are considered to be ultimate beneficial owners and own at least 25% of the company',
              instructionsUbo:
                'After submitting the form all the individuals will be followed up via emails with a request to go through a standard KYC/AML procedure.',
              subTitleRepresentative: '',
              instructionsRepresentative: '',
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
                    name: 'phone',
                    required: true
                  },
                  {
                    name: 'email',
                    required: true
                  },
                  {
                    name: 'nationality',
                    required: true
                  }
                ],
                shareholder: [
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
                    name: 'phone',
                    required: true
                  },
                  {
                    name: 'email',
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
                    name: 'phone',
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
                ubo: false,
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
            APPLICANT_REQUEST: {
              title: 'Start Verification for Moneyport',
              button: 'Upload New Documents'
            }
          },
          customCssStr: '\n'
        },
        documentsByCountries: {}
      },
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
