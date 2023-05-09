import { CompanyTypeEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/CompanyTypeEnum'
import { DefaultSelectValueConst } from '~/models/local/constants/DefaultSelectValueConst'

export const CompanyTypeSelectConst: { value: CompanyTypeEnum; text: string }[] = [
    { ...DefaultSelectValueConst },
    { value: CompanyTypeEnum.LLC, text: 'LLC' },
    { value: CompanyTypeEnum.SOLE_TRADER, text: 'Sole Trader' },
    { value: CompanyTypeEnum.PUBLIC_LIMITED_COMPANY, text: 'Public Limited Company' },
    { value: CompanyTypeEnum.LIMITED_LIABILITY_PARTNERSHIP, text: 'Limited Liability Partnership' },
    { value: CompanyTypeEnum.NON_PROFIT_ORGANISATION, text: 'Non Profit Organisation' },
]
