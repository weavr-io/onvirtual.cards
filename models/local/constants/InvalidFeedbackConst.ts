export const INVALID_FEEDBACK_CONST: Record<string, string> = {
    required: 'This is a required field.',
    url: 'Please make sure that it is a valid URL.',
    terms: 'Please accept terms and conditions.',
    email: 'Please enter a valid email address.',
    password:
        'Please enter a valid password - must be between 8 and 30 characters, and must include lowercase, uppercase, number and special characters.',
    newPassword:
        'Please enter a valid password - must be between 8 and 30 characters, must be different from the current password and must include lowercase, uppercase, number and special characters.',
    confirmPassword: 'Confirmation password should be the same as password.',
    numeric: 'Field must be numeric.',
    maxLength: 'This field should not exceed 50 characters.',
    minLength: 'This field requires at least 6 characters.',
    baseRegexValidation: 'This field contains invalid characters.',
    name: 'This field contains invalid characters.',
    surname: 'This field contains invalid characters.',
    tag: 'This field contains invalid characters.',
    mobileNumber: 'This field contains invalid characters.',
    feeKey: 'This field contains invalid characters.',
    minValue: 'Please enter a greater value.',
}
