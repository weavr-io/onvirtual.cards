'use strict'

export interface SecureClient {
    init(publicApiKey: string, options: SecureClientOptions): void

    associate(authToken: string, resolve?: () => void, reject?: (e?: any) => void): void

    kyb(): KYB

    kyc(): KYC

    consumer_kyc(): ConsumerVerificationFlowContract

    form(): SecureForm

    span(field: string, token: string, options?: SecureSpanOptions): SecureSpan
}

export interface SecureForm {
    input(name: string, field: string, options?: SecureInputOptions): SecureInput

    tokenize(
        resolve?: (tokens: { [key: string]: string }) => void,
        reject?: (e?: any) => void
    ): void

    destroy(): this
}

export interface SecureInput {
    update(options?: SecureInputOptions): void

    focus(): this

    blur(): this

    mount(el: HTMLElement | string): this

    clear(): this

    unmount(): this

    destroy(): this

    addListener(event: string, listener: (...args: any[]) => void): this

    on(event: string, listener: (...args: any[]) => void): this

    removeListener(event: string, listener: (...args: any[]) => void): this

    off(event: string, listener: (...args: any[]) => void): this

    removeAllListeners(event?: string): this
}

export interface SecureSpan {
    update(options?: SecureInputOptions): this

    mount(el: HTMLElement | string): this

    unmount(): this

    destroy(): this

    addListener(event: string, listener: (...args: any[]) => void): this

    on(event: string, listener: (...args: any[]) => void): this

    removeListener(event: string, listener: (...args: any[]) => void): this

    off(event: string, listener: (...args: any[]) => void): this

    removeAllListeners(event?: string): this
}

export interface SecureClientOptions {
    fonts: (SecureElementStyleFontSrc | SecureElementStyleFont)[]
}

export interface SecureElementStyleFontSrc {
    cssSrc: string
}

export interface SecureElementStyleFont {
    family: string
    src: string
    style?: string
    unicodeRange?: string
    weight?: string
    variant?: string
    stretch?: string
}

export interface SecureInputOptions {
    classNames?: SecureInputOptionsClasses
    placeholder?: string
    maxlength?: number
    autocorrect?: string
    style?: SecureElementStyles
}

export interface SecureInputOptionsClasses {
    base?: string
    empty?: string
    focus?: string
    valid?: string
    invalid?: string
    autofill?: string
}

export interface SecureSpanOptions {
    className?: string
    autocorrect?: string
    style?: SecureElementStyleWithPseudoClasses
}

export interface SecureElementStyles {
    base?: SecureElementStyleWithPseudoClasses
    empty?: SecureElementStyleWithPseudoClasses
    valid?: SecureElementStyleWithPseudoClasses
    invalid?: SecureElementStyleWithPseudoClasses
}

export interface SecureElementStyle {
    color?: string
    fontFamily?: string
    fontSize?: string
    fontSmoothing?: string
    fontStyle?: string
    fontVariant?: string
    fontWeight?: string
    height?: string
    letterSpacing?: string
    lineHeight?: string
    margin?: string
    padding?: string
    textAlign?: string
    textDecoration?: string
    textIndent?: string
    textShadow?: string
    textTransform?: string
}

export interface SecureElementStyleWithPseudoClasses extends SecureElementStyle {
    ':hover'?: SecureElementStyle
    ':focus'?: SecureElementStyle
    '::placeholder'?: SecureElementStyle
    '::selection'?: SecureElementStyle
    ':-webkit-autofill'?: SecureElementStyle
}

export interface KYBAuthObject {
    externalUserId?: string
    accessToken?: string
    reference?: bigint | string
}

export interface KYBOptions {
    customCss?: string
}

export interface KYB {
    init(
        selector: string,
        auth: KYBAuthObject,
        listener: (messageType: any, payload: any) => void,
        options?: KYBOptions
    ): void
}

export interface KYCAuthObject {
    externalUserId?: string
    accessToken?: string
    reference?: bigint | string
}

export interface KYCOptions {
    customCss?: string
}

export interface KYC {
    init(
        selector: string,
        auth: KYCAuthObject,
        listener: (messageType: any, payload: any) => void,
        options?: KYCOptions
    ): void
}

export interface ConsumerKYC {}

export declare type VerificationFlowLoadHandler = () => void
export declare type VerificationFlowLaunchHandler = (
    response: CorporateVerificationFlowLoadAndLaunchParams
) => void

export interface VerificationFlow {
    getPath(reference: bigint): string

    getParams(authToken: string, reference: bigint, callback: VerificationFlowLaunchHandler): void

    getParamsLoadAndLaunch(authToken: string, reference: bigint): void

    loadAndLaunch(
        params:
            | CorporateVerificationFlowLoadAndLaunchParams
            | ConsumerVerificationFlowLoadAndLaunchParams
    ): SumSub
}

export interface ConsumerVerificationFlowLaunchParams {
    reference: bigint | string
}
export interface CorporateVerificationFlowLaunchParams {
    reference: bigint | string
}

export interface ConsumerVerificationFlowContract extends VerificationFlow {
    options: ConsumerVerificationFlowOptions

    loadAndLaunch(params: ConsumerVerificationFlowLoadAndLaunchParams): SumSub

    launch(params: ConsumerVerificationFlowLaunchParams): void

    init(params: ConsumerVerificationFlowInitOption): void
}

export interface VerificationFlowProvider {
    type: VerificationFlowProviders.SUMSUB

    load(callback: VerificationFlowLoadHandler): void
}

export interface VerificationFlowOptions {
    selector: string

    onMessage?: (message: string, additionalInfo?: any) => void
    onError?: (message: any) => void
    customCss?: string
    customCssStr?: string
}

export interface ConsumerVerificationFlowInitOption
    extends ConsumerVerificationFlowOptions,
        ConsumerVerificationFlowLaunchParams {}

export interface ConsumerVerificationFlowOptions extends VerificationFlowOptions {}

export interface CorporateVerificationFlowOptions extends VerificationFlowOptions {}

export interface LaunchParams {
    email?: string
    mobile?: string
}

export interface SumSubConsumerVerificationFlowLoadAndLaunchParams extends LaunchParams {
    accessToken: string
    verificationFlow: string
    externalUserId?: bigint
    kycProviderKey?: VerificationFlowProviders.SUMSUB
}

export type ConsumerVerificationFlowLoadAndLaunchParams =
    SumSubConsumerVerificationFlowLoadAndLaunchParams

export type CorporateVerificationFlowLoadAndLaunchParams =
    SumSubConsumerVerificationFlowLoadAndLaunchParams

export interface SumSub extends VerificationFlowProvider {
    type: VerificationFlowProviders.SUMSUB

    launch(
        params:
            | ConsumerVerificationFlowLoadAndLaunchParams
            | CorporateVerificationFlowLoadAndLaunchParams
    ): void
}

export enum VerificationFlowProviders {
    SUMSUB = 'sumsub',
}
