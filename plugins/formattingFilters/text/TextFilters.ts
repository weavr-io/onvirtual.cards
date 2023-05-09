export enum InputCaseTypeEnum {
    SNAKE_CASE = 'SNAKE_CASE',
    TITLE_CASE = 'TITLE_CASE',
    KEBAB_CASE = 'KEBAB_CASE',
    CAMEL_CASE = 'CAMEL_CASE',
}

export class TextFilters {
    inputCaseOptions = InputCaseTypeEnum

    removeUnderscore(value) {
        return value.split('_').join(' ')
    }

    firstLetter(value: string) {
        return value.charAt(0)
    }

    convertToKebabCase(value: string) {
        return value.split(' ').join('_')
    }

    convertToCamelCase(value: string) {
        const result = value.replace(/([A-Z])/g, ' $1')
        return result.charAt(0).toUpperCase() + result.slice(1)
    }

    convertToTitleCase(value: string, inputCase?: InputCaseTypeEnum) {
        switch (inputCase) {
            case InputCaseTypeEnum.SNAKE_CASE:
                return value
                    .toLowerCase()
                    .replaceAll('_', ' ')
                    .replace(/^(.)|\s+(.)/g, (e) => {
                        return e.toUpperCase()
                    })
            case InputCaseTypeEnum.CAMEL_CASE:
                return (
                    value
                        .replace(/([A-Z])/g, ' $1')
                        .charAt(0)
                        .toUpperCase() + value.slice(1)
                )
            default:
                return value
        }
    }

    convertSnakeToTitleCase(value: string) {
        return this.convertToTitleCase(value, InputCaseTypeEnum.SNAKE_CASE)
    }
}
