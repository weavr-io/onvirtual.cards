export default ({}, inject) => {
  inject('userpilot', () => {
    // @ts-ignore
    return window.userpilot
  })
}

export interface UserPilot{
  (): {
    track(event: string, properties: any): void
    reload(): void
    identify(userId?: string, traits?: any): void
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    readonly $userpilot: UserPilot
  }
}
