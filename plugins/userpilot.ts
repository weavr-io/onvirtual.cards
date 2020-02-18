export default ({}, inject) => {
  inject('userPilotIdentify', (userId: string, options: any) => {
    // @ts-ignore
    window.userpilot.identify(userId, options)
  })

  inject('userPilotPage', () => {
    // @ts-ignore
    window.userpilot.reload()
  })
}

export interface UserPilotIdentify {
  (userId: string, options: any): void
}

export interface UserPilotPage {
  (): void
}

declare module 'vue/types/vue' {
  interface Vue {
    readonly $userPilotIdentify: UserPilotIdentify
    readonly $userPilotPage: UserPilotPage
  }
}
