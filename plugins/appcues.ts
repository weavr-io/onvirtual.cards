export default ({}, inject) => {
  inject('appcuesIdentify', (userId: string, options: any) => {
    // @ts-ignore
    window.Appcues.identify(userId, options)
  })

  inject('appcuesPage', () => {
    // @ts-ignore
    window.Appcues.page()
    console.log('here')
  })
}

export interface AppcuesIdentify {
  (userId: string, options: any): void
}

export interface AppcuesPage {
  (): void
}

declare module 'vue/types/vue' {
  interface Vue {
    readonly $appcuesIdentify: AppcuesIdentify
    readonly $appcuesPage: AppcuesPage
  }
}
