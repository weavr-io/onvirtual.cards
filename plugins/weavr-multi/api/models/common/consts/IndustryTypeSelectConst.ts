import { IndustryTypeEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/IndustryTypeEnum'
import { DefaultSelectValueConst } from '~/models/local/constants/DefaultSelectValueConst'

export const IndustryTypeSelectConst: { value: string; text: string }[] = [
    { ...DefaultSelectValueConst },
    { value: IndustryTypeEnum.ACCOUNTING, text: 'Accounting' },
    { value: IndustryTypeEnum.AUDIT, text: 'Audit' },
    { value: IndustryTypeEnum.FINANCE, text: 'Finance' },
    { value: IndustryTypeEnum.PUBLIC_SECTOR_ADMINISTRATION, text: 'Public sector/ Administration' },
    { value: IndustryTypeEnum.ART_ENTERTAINMENT, text: 'Art/Entertainment' },
    { value: IndustryTypeEnum.AUTO_AVIATION, text: 'Auto/Aviation' },
    { value: IndustryTypeEnum.BANKING_LENDING, text: 'Banking/ Lending' },
    { value: IndustryTypeEnum.BUSINESS_CONSULTANCY_LEGAL, text: 'Business/ Consultancy/ Legal' },
    { value: IndustryTypeEnum.CONSTRUCTION_REPAIR, text: 'Construction/ Repair' },
    {
        value: IndustryTypeEnum.EDUCATION_PROFESSIONAL_SERVICES,
        text: 'Education/Professional services',
    },
    { value: IndustryTypeEnum.INFORMATIONAL_TECHNOLOGIES, text: 'Informational technologies' },
    { value: IndustryTypeEnum.TOBACCO_ALCOHOL, text: 'Tobacco/Alcohol' },
    { value: IndustryTypeEnum.GAMING_GAMBLING, text: 'Gaming/Gambling' },
    { value: IndustryTypeEnum.MEDICAL_SERVICES, text: 'Medical Services' },
    { value: IndustryTypeEnum.PRECIOUS_GOODS_JEWELRY, text: 'Precious goods/ Jewelry' },
    {
        value: IndustryTypeEnum.NON_GOVERNMENTAL_ORGANIZATION,
        text: 'Non-governmental organization',
    },
    { value: IndustryTypeEnum.INSURANCE_SECURITY, text: 'Insurance/Security' },
    { value: IndustryTypeEnum.RETAIL_WHOLESALE, text: 'Retail/ Wholesale' },
    { value: IndustryTypeEnum.TRAVEL_TOURISM, text: 'Travel/ Tourism' },
    { value: IndustryTypeEnum.FREELANCER, text: 'Freelancer' },
]
