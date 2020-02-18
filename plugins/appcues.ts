export default ({}, inject) => {
  inject('appcues', () => {
    // @ts-ignore
    return window.Appcues
  })
}

export interface Appcues {
  (): {
    page(): void
    identify(userId?: string, traits?: any): void
    track(event: string, properties: any): void
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    readonly $appcues: Appcues
  }
}
