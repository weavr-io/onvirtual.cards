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
        externalUserId: 'Liliana.Purdy27@hotmail.com',
        accessToken: '_act-a0450d5f-d4d7-4d96-9475-58ca12c185a2',
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
