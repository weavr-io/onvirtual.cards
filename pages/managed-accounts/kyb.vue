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
        skipWelcomeScreen: false,
        skipReviewScreen: false,
        skipAgreementsScreen: true,
        registration: 'disabled'
      },
      uiConf: {
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
        },
        // customCssStr: '\n'
        customCssStr: "ul { column-count: 1; }"
           
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
