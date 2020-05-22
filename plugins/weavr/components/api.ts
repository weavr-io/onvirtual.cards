'use strict'

export interface SecureClient {
  init(publicApiKey: string, options: SecureClientOptions): void

  associate(authToken: string, resolve?: () => void, reject?: (e?: any) => void): void

  kyb(): KYB

  kyc(): KYC

  form(): SecureForm

  span(field: string, token: string, options?: SecureSpanOptions): SecureSpan
}

export interface SecureForm {
  input(name: string, field: string, options?: SecureInputOptions): SecureInput

  tokenize(resolve?: (tokens: { [key: string]: string }) => void, reject?: (e?: any) => void): void

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

export interface SumSubAuthObject {
  externalUserId: string
  accessToken: string
}

export interface KYBAuthObject extends SumSubAuthObject {}

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

export interface KYCAuthObject extends SumSubAuthObject {}

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
